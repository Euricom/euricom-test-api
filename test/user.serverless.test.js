const { handler } = require('../src/api/serverless/handlers/userHandler');
const { withParse } = require('../src/api/serverless/helper');
const db = require('../src/dbConnection');

const { seedUsers, getUser } = require('../src/repository/users');

const userHandler = withParse(handler);

describe('User Routes', () => {
  let event;
  let context;
  beforeEach(async () => {
    await db.connectToDb();
    await db.dropDb();
    event = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    context = {};
  });
  afterAll(() => db.closeConnection());

  it('fetches users', async () => {
    await seedUsers(3);
    const newEvent = { ...event, path: `api/users`, httpMethod: 'GET' };
    const response = await userHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('users');
    expect(response.body.users.length).toBe(3);
  });

  it('fetches a user', async () => {
    await seedUsers(1);
    const user = await getUser(1000);

    const newEvent = { ...event, path: `api/users/${user._id}`, httpMethod: 'GET' };
    const response = await userHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toEqual(user._id);
  });

  it('throws a 404 on wrong user ID', async () => {
    await seedUsers(1);

    const newEvent = { ...event, path: `api/users/2`, httpMethod: 'GET' };
    const response = await userHandler(newEvent, context);

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('User not found');
  });

  it('creates a user', async () => {
    const user = {
      firstName: 'peter',
      lastName: 'cosemans',
      age: 52,
      email: 'peter.cosemans@gmail.com',
      role: 'admin',
    };

    const newEvent = { ...event, path: `api/users`, httpMethod: 'POST', body: user };
    const response = await userHandler(newEvent, context);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toEqual(user.firstName);
    expect(response.body.lastName).toEqual(user.lastName);
  });

  it('updates a user', async () => {
    await seedUsers(1);
    const oldUser = await getUser(1000);
    const newUser = {
      firstName: 'Jonas',
      lastName: 'Van Eeckhout',
      age: oldUser.age,
      email: oldUser.email,
      role: oldUser.role,
    };

    const newEvent = { ...event, path: `api/users/${oldUser._id}`, httpMethod: 'PUT', body: newUser };
    const response = await userHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toEqual(newUser.firstName);
    expect(response.body.lastName).toEqual(newUser.lastName);
  });

  it('throws a 404 on wrong user ID', async () => {
    await seedUsers(1);
    const oldUser = await getUser(1000);
    const newUser = {
      firstName: 'Jonas',
      lastName: 'Van Eeckhout',
      age: oldUser.age,
      email: oldUser.email,
      role: oldUser.role,
    };

    const newEvent = { ...event, path: `api/users/2`, httpMethod: 'PUT', body: newUser };
    const response = await userHandler(newEvent, context);

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('User not found');
  });

  it('deletes a user', async () => {
    await seedUsers(1);
    const user = await getUser(1000);

    const newEvent = { ...event, path: `api/users/${user._id}`, httpMethod: 'DELETE' };
    const response = await userHandler(newEvent, context);

    const newUser = await getUser(1000);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toEqual(user._id);
    expect(newUser).toBe(null);
  });

  it('throws a 204 on wrong user ID', async () => {
    await seedUsers(1);

    const newEvent = { ...event, path: `api/users/2`, httpMethod: 'DELETE' };
    const response = await userHandler(newEvent, context);

    expect(response.statusCode).toBe(204);
  });
});
