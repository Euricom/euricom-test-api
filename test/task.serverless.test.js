const { handler } = require('../src/api/serverless/handlers/taskHandler');
const { withParse } = require('../src/api/serverless/helper');
const db = require('../src/dbConnection');

const { getTask, seedTasks } = require('../src/repository/tasks');

const taskHandler = withParse(handler);

describe('Task Routes', () => {
  let event;
  let context;
  beforeEach(async () => {
    await db.connectToDb();
    await db.dropDb();
    await seedTasks();
    event = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    context = {};
  });

  afterAll(() => {
    db.closeConnection();
  });

  it('fetches tasks', async () => {
    const newEvent = { ...event, path: `api/tasks`, httpMethod: 'GET' };
    const response = await taskHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it('fetches a task', async () => {
    const task = await getTask(1);

    const newEvent = { ...event, path: `api/tasks/${task._id}`, httpMethod: 'GET' };
    const response = await taskHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBe(null);
    expect(response.body.id).toBe(task._id);
  });

  it('throws a 404 on wrong task ID', async () => {
    const newEvent = { ...event, path: `api/tasks/111`, httpMethod: 'GET' };
    const response = await taskHandler(newEvent, context);

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Task not found');
  });

  it('creates a task', async () => {
    const task = {
      desc: 'Eat Bagel',
    };

    const newEvent = { ...event, path: `api/tasks`, httpMethod: 'POST', body: task };
    const response = await taskHandler(newEvent, context);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('desc');
    expect(response.body).toHaveProperty('completed');
  });

  it('updates a task', async () => {
    const oldTask = await getTask(1);

    const newTask = {
      completed: false,
    };

    const newEvent = { ...event, path: `api/tasks/${oldTask._id}`, httpMethod: 'PATCH', body: newTask };
    const response = await taskHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body.completed).toEqual(newTask.completed);
  });

  it('throws a 404 on wrong task ID', async () => {
    const newEvent = { ...event, path: `api/tasks/122`, httpMethod: 'PATCH', body: { completed: true } };
    const response = await taskHandler(newEvent, context);

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Task not found');
  });

  it('deletes a task', async () => {
    const oldTask = await getTask(1);

    const newEvent = { ...event, path: `api/tasks/${oldTask._id}`, httpMethod: 'DELETE' };
    const response = await taskHandler(newEvent, context);

    const newTask = await getTask(1);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toEqual(oldTask._id);
    expect(newTask).toEqual(null);
  });

  it('throws a 204 on wrong task ID', async () => {
    const newEvent = { ...event, path: `api/tasks/122`, httpMethod: 'DELETE' };
    const response = await taskHandler(newEvent, context);

    expect(response.statusCode).toBe(204);
  });
});
