const fs = require('fs');
const path = require('path');

const request = require('supertest');
const app = require('../src/express');

const { seedUsers, getAllUsers, getUser, clearUsers } = require('../src/repository/users');

describe('User Routes', () => {
  beforeEach(() => {
    clearUsers();
  });

  it('fetches users', async () => {
    seedUsers(3);
    const response = await request(app.app)
      .get('/api/users')
      .expect(200);

    expect(response.body).toHaveProperty('total');
    expect(response.body).toHaveProperty('users');
    expect(response.body.users.length).toBe(3);
  });

  it('fetches users', async () => {
    seedUsers(1);
    const user = getUser(1000);

    const response = await request(app.app)
      .get(`/api/users/${user.id}`)
      .expect(200);

    expect(response.body.id).toEqual(user.id);
  });

  it('throws a 404 on wrong user ID', async () => {
    seedUsers(1);

    const response = await request(app.app)
      .get('/api/users/2')
      .expect(404);

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

    const response = await request(app.app)
      .post('/api/users')
      .send(user)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toEqual(user.firstName);
    expect(response.body.lastName).toEqual(user.lastName);
  });

  it('updates a user', async () => {
    seedUsers(1);
    const oldUser = getUser(1000);
    const newUser = {
      firstName: 'Jonas',
      lastName: 'Van Eeckhout',
      age: oldUser.age,
      email: oldUser.email,
      role: oldUser.role,
    };

    const response = await request(app.app)
      .put(`/api/users/${oldUser.id}`)
      .send(newUser)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toEqual(newUser.firstName);
    expect(response.body.lastName).toEqual(newUser.lastName);
  });

  it('throws a 404 on wrong user ID', async () => {
    seedUsers(1);

    const response = await request(app.app)
      .put('/api/users/2')
      .expect(404);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('User not found');
  });

  it('deletes a user', async () => {
    seedUsers(1);
    const user = getUser(1000);

    const response = await request(app.app)
      .delete(`/api/users/${user.id}`)
      .expect(200);

    const newUser = getUser(1000);

    expect(response.body.id).toEqual(user.id);
    expect(newUser).toBe(undefined);
  });

  it('throws a 404 on wrong user ID', async () => {
    seedUsers(1);

    const response = await request(app.app)
      .delete('/api/users/2')
      .expect(204);
  });
});
