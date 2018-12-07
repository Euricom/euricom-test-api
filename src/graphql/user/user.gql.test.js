const supertest = require('supertest');
const gqltest = require('../../../test/gqltest');
const app = require('../../express');
const userData = require('../../data/users');

const request = gqltest('/graphql', supertest);
const agent = request(app);

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

    const res = await agent.postQuery(query, {});

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.allUsers.totalCount).toBe(3);
    expect(res.body.data.allUsers.edges.length).toBe(3);
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

    const res = await agent.postQuery(query, { id: 1000 });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.user.id).toBe(1000);
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

    const res = await agent.postMutation(mutation, newUser);

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.addOrUpdateUser.user).toHaveProperty('id');
    expect(res.body.data.addOrUpdateUser.user.email).toBe(newUser.input.email);
    expect(res.body.data.addOrUpdateUser.user.lastName).toBe(newUser.input.lastName);
    expect(res.body.data.addOrUpdateUser.user.firstName).toBe(newUser.input.firstName);
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

    const res = await agent.postMutation(mutation, newUser, 200);

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.addOrUpdateUser.user.id).toBe(newUser.input.id);
    expect(res.body.data.addOrUpdateUser.user.email).toBe(newUser.input.email);
    expect(res.body.data.addOrUpdateUser.user.lastName).toBe(newUser.input.lastName);
    expect(res.body.data.addOrUpdateUser.user.firstName).toBe(newUser.input.firstName);
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

    const res = await agent.postMutation(mutation, { id: 1000 }, 200);

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.deleteUser.user.id).toBe(1000);
  });
});
