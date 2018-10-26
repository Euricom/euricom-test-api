const helpers = require('./helpers/helpers');

const userData = require('../src/repository/users');

describe('GraphQL User', () => {
  beforeEach(() => {
    userData.clearUsers();
    userData.seedUsers(3);
  });

  test('query users', async () => {
    const query = `
    {
      allUsers {
        totalCount
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
            node {
                id
                firstName
                lastName
                age
                email
                image
                phone
                company
                address {
                  street
                  zip
                  city
                }
            }
        }
      }
    }
    `;

    const data = await helpers.executeQuery(query, {}, 200);

    expect(data.data.allUsers.totalCount).toBe(3);
    expect(data.data.allUsers.edges.length).toBe(3);
  });

  test('query users', async () => {
    const query = `
    query user($id: Int){
      user(id: $id) {
        id
        firstName
        lastName
        age
        email
        image
        phone
        company
        address {
          street
          zip
          city
        }
      }
    }
    `;

    const data = await helpers.executeQuery(query, { id: 1000 }, 200);

    expect(data.data.user.id).toBe(1000);
  });

  test('create user on mutation addOrUpdateUser', async () => {
    const newUser = {
      input: {
        firstName: 'jos',
        lastName: 'vangenechten',
        email: 'wow@wow.com',
      },
    };
    const mutation = `
    mutation addOrUpdateUser($input: UserInput!){
      addOrUpdateUser(input: $input) {
        user {
          id
          firstName
          lastName
          age
          email
          image
          phone
          company
          address {
            street
            zip
            city
          }
        }
      }
    }
    `;

    const data = await helpers.executeMutation(mutation, newUser, 200);

    expect(data.data.addOrUpdateUser.user).toHaveProperty('id');
    expect(data.data.addOrUpdateUser.user.email).toBe(newUser.input.email);
    expect(data.data.addOrUpdateUser.user.lastName).toBe(newUser.input.lastName);
    expect(data.data.addOrUpdateUser.user.firstName).toBe(newUser.input.firstName);
  });

  test('update user on mutation addOrUpdateUser', async () => {
    const newUser = {
      input: {
        id: 1000,
        firstName: 'jos',
        lastName: 'vangenechten',
        email: 'wow@wow.com',
      },
    };
    const mutation = `
    mutation addOrUpdateUser($input: UserInput!){
      addOrUpdateUser(input: $input) {
        user {
          id
          firstName
          lastName
          age
          email
          image
          phone
          company
          address {
            street
            zip
            city
          }
        }
      }
    }
    `;

    const data = await helpers.executeMutation(mutation, newUser, 200);

    expect(data.data.addOrUpdateUser.user.id).toBe(newUser.input.id);
    expect(data.data.addOrUpdateUser.user.email).toBe(newUser.input.email);
    expect(data.data.addOrUpdateUser.user.lastName).toBe(newUser.input.lastName);
    expect(data.data.addOrUpdateUser.user.firstName).toBe(newUser.input.firstName);
  });

  test('mutation deleteUser', async () => {
    const mutation = `
    mutation deleteUser($id: Int!){
      deleteUser(id: $id) {
        user {
          id
          firstName
          lastName
          age
          email
          image
          phone
          company
          address {
            street
            zip
            city
          }
        }
      }
    }
    `;

    const data = await helpers.executeMutation(mutation, { id: 1000 }, 200);

    expect(data.data.deleteUser.user.id).toBe(1000);
  });
});
