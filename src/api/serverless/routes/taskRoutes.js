/* eslint-disable no-param-reassign */
const app = require('lambda-api')();
const createTaskCommand = require('../../../domain/commands/tasks/createTaskCommand');
const updateTaskCommand = require('../../../domain/commands/tasks/updateTaskCommand');
const deleteTaskCommand = require('../../../domain/commands/tasks/deleteTaskCommand');
const { getAllTasks, getTask } = require('../../../repository/tasks');
const mapper = require('../../mappers/taskToResource');
const httpErrors = require('../../../httpErrors');
const errorHandler = require('../../middleware/errorHandler');
const taskSchema = require('../../schemas/task');
const updateTaskSchema = require('../../schemas/updateTask');
const validate = require('../middleware/validator');

app.use((req, res, next) => {
  res.cors();
  next();
});

app.use(errorHandler);

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await getAllTasks();
    const resource = tasks.map((item) => mapper.map(item));

    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await getTask(+req.params.id);

    if (!task) {
      throw new httpErrors.NotFoundError('Task not found');
    }
    const resource = mapper.map(task);
    // return resource
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

/* POST /api/tasks
   {
     "completed": true
   }
  */
app.post('/api/tasks', async (req, res) => {
  try {
    const validationError = await validate(taskSchema, req.body);
    if (validationError) {
      throw new httpErrors.BadRequestError(validationError);
    }
    const task = await createTaskCommand.execute(req.body);
    const resource = mapper.map(task);

    return res.status(201).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

/* PATCH /api/tasks/12
   {
     "completed": true
   }
  */
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const validationError = await validate(updateTaskSchema, req.body);
    if (validationError) {
      throw new httpErrors.BadRequestError(validationError);
    }
    const oldTask = await getTask(+req.params.id);
    if (!oldTask) {
      throw new httpErrors.NotFoundError('Task not found');
    }
    const newTask = await updateTaskCommand.execute(req.body, +req.params.id);
    const resource = mapper.map(newTask);
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

// DELETE /api/tasks/12
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await getTask(+req.params.id);
    if (!task) {
      return res.status(204).json();
    }
    await deleteTaskCommand.execute(+req.params.id);
    const resource = mapper.map(task);
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

module.exports = app;
