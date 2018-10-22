const faker = require('faker');
const _ = require('underscore');

let users = [];

function generateUsers(count) {
    const users = [];
    for (let i = 0; i < count; i++) {
        // eslint-disable-line
        let firstName;
        let imageUrl;
        const random = faker.random.number(2);
        const lastName = faker.name.lastName();
        if (random === 1) {
            firstName = faker.name.firstName(1);
            imageUrl = `http://api.randomuser.me/portraits/lego/${faker.random.number(
        9,
      )}.jpg`;
            // imageUrl = `https://api.adorable.io/avatars/400/${firstName}-${lastName}`;
        } else {
            firstName = faker.name.firstName(0);
            imageUrl = `http://api.randomuser.me/portraits/lego/${faker.random.number(
        9,
      )}.jpg`;
            // imageUrl = `https://api.adorable.io/avatars/400/${firstName}-${lastName}`;
        }
        users.push({
            id: 1000 + i,
            firstName,
            lastName,
            age: faker.random.number(100),
            email: `${firstName}.${lastName}@${faker.internet.domainName()}`.toLowerCase(),
            image: imageUrl,
            phone: faker.phone.phoneNumber(),
            company: faker.company.companyName(),
            address: {
                street: faker.address.streetName(),
                city: faker.address.city(),
                zip: faker.address.zipCode(),
            },
        });
    }
    return users;
}

module.exports = {
    clearUsers() {
        users = [];
    },
    seedUsers(numberOfUsers) {
        users = generateUsers(numberOfUsers);
    },
    getAllUsers() {
        return users;
    },
    getUser(id) {
        return users.find((user) => user.id === id);
    },
    deleteUser(user) {
        users = _.without(users, user);
        return users;
    },
    addUser(user) {
        users.push(user);
        return user;
    },
};
