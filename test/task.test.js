const request = require('supertest');
const app = require('../src/express');
const db = require('../src/dbConnection');

const { getTask, seedTasks } = require('../src/repository/tasks');

describe('Task Routes', () => {
  beforeEach(async () => {
    await db.connectToDb();
    await db.dropDb();
    await seedTasks();
  });
  afterAll(() => db.closeConnection());

  it('fetches tasks', async () => {
    const response = await request(app.app)
      .get('/api/tasks')
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it('fetches a task', async () => {
    const task = await getTask(1);

    const response = await request(app.app)
      .get(`/api/tasks/${task._id}`)
      .expect(200);

    expect(response.body).not.toBe(null);
    expect(response.body.id).toBe(task._id);
  });

  it('throws a 404 on wrong task ID', async () => {
    const response = await request(app.app)
      .get('/api/tasks/122')
      .expect(404);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Task not found');
  });

  it('creates a task', async () => {
    const task = {
      desc: 'Eat Bagel',
    };

    const response = await request(app.app)
      .post('/api/tasks')
      .send(task)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('desc');
    expect(response.body).toHaveProperty('completed');
  });

  it('updates a task', async () => {
    const oldTask = await getTask(1);

    const newTask = {
      completed: false,
    };

    const response = await request(app.app)
      .patch(`/api/tasks/${oldTask._id}`)
      .send(newTask)
      .expect(200);

    expect(response.body.completed).toEqual(newTask.completed);
  });

  it('throws a 404 on wrong task ID', async () => {
    const response = await request(app.app)
      .patch('/api/tasks/122')
      .send({ completed: true })
      .expect(404);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Task not found');
  });

  it('deletes a task', async () => {
    const oldTask = await getTask(1);

    const response = await request(app.app)
      .delete(`/api/tasks/${oldTask._id}`)
      .expect(200);

    const newTask = await getTask(1);

    expect(response.body.id).toEqual(oldTask._id);
    expect(newTask).toEqual(null);
  });

  it('throws a 204 on wrong task ID', async () => {
    await request(app.app)
      .delete('/api/tasks/122')
      .expect(204);
  });
});
