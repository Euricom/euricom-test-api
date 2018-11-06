const faker = require('faker');
const db = require('../dbConnection');

function generateUsers(count) {
  let userCount = count;
  if (!userCount || !Number.isInteger(userCount)) {
    userCount = 10;
  }
  const users = [];
  for (let i = 0; i < userCount; i += 1) {
    // eslint-disable-line
    let firstName;
    let imageUrl;
    const random = faker.random.number(2);
    const lastName = faker.name.lastName();
    if (random === 1) {
      firstName = faker.name.firstName(1);
      imageUrl = `http://api.randomuser.me/portraits/lego/${faker.random.number(9)}.jpg`;
      // imageUrl = `https://api.adorable.io/avatars/400/${firstName}-${lastName}`;
    } else {
      firstName = faker.name.firstName(0);
      imageUrl = `http://api.randomuser.me/portraits/lego/${faker.random.number(9)}.jpg`;
      // imageUrl = `https://api.adorable.io/avatars/400/${firstName}-${lastName}`;
    }
    users.push({
      _id: 1000 + i,
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
      role: 'user',
    });
  }
  return users;
}

const clearUsers = async () => db.collection('users').drop();

const seedUsers = async (count) => {
  const users = generateUsers(count);
  return db.collection('users').insertMany(users);
};

const getUsersCount = async () => db.collection('users').countDocuments();

const getAllUsers = async (page = 0, pageSize = 20) =>
  db
    .collection('users')
    .find({})
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

const getUser = (id) => db.collection('users').findOne({ _id: id });

const deleteUser = (id) => db.collection('users').remove({ _id: id });

const addUser = (user) => db.collection('users').insertOne(user);

const saveUser = (user, id) => db.collection('users').findOneAndReplace({ _id: id }, user, { returnOriginal: false });

module.exports = {
  clearUsers,
  seedUsers,
  getUsersCount,
  getAllUsers,
  getUser,
  deleteUser,
  addUser,
  saveUser,
};
