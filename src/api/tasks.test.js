const fs = require('fs');
const path = require('path');

const request = require('supertest');
const app = require('../express');
const { getAllTasks, getTask, clearTasks, seedTasks } = require('../data/tasks');

const agent = request(app);

describe('Task Routes', () => {
  beforeEach(() => {
    clearTasks();
    seedTasks();
  });

  it('fetches tasks', async () => {
    const response = await agent.get('/api/tasks').expect(200);

    expect(response.body.length).toBeGreaterThan(0);
  });

  it('fetches a task', async () => {
    const task = getTask(1);

    const response = await agent.get(`/api/tasks/${task.id}`).expect(200);

    expect(response.body).not.toBe(null);
    expect(response.body.id).toBe(task.id);
  });

  it('throws a 404 on wrong task ID', async () => {
    const response = await agent.get('/api/tasks/122').expect(404);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Task not found');
  });

  it('creates a task', async () => {
    const task = {
      desc: 'Eat Bagel',
    };

    const response = await agent
      .post('/api/tasks')
      .send(task)
      .expect(201);

    const tasks = getAllTasks();

    expect(tasks[tasks.length - 1].id).toEqual(response.body.id);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('desc');
    expect(response.body).toHaveProperty('completed');
  });

  it('updates a task', async () => {
    const task = {
      completed: false,
    };

    const response = await agent
      .patch('/api/tasks/1')
      .send(task)
      .expect(200);

    expect(response.body.completed).toEqual(task.completed);
  });

  it('throws a 404 on wrong task ID', async () => {
    const response = await agent.patch('/api/tasks/122').expect(404);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Task not found');
  });

  it('deletes a task', async () => {
    const oldTask = getTask(1);

    const response = await agent.delete(`/api/tasks/${oldTask.id}`).expect(200);

    const newTask = getTask(1);

    expect(response.body.id).toEqual(oldTask.id);
    expect(newTask).toEqual(undefined);
  });

  it('throws a 204 on wrong task ID', async () => {
    const response = await agent.delete('/api/tasks/122').expect(204);
  });
});
