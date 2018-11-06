const express = require('express');
const asyncify = require('express-asyncify');
const { getAllTasks, getTask } = require('../../../repository/tasks');
const httpErrors = require('../../../httpErrors');
const validate = require('../../middleware/validator');
const mapper = require('../../mappers/taskToResource');
const createTaskCommand = require('../../../domain/commands/tasks/createTaskCommand');
const updateTaskCommand = require('../../../domain/commands/tasks/updateTaskCommand');
const deleteTaskCommand = require('../../../domain/commands/tasks/deleteTaskCommand');
const taskSchema = require('../../schemas/task');
const updateTaskSchema = require('../../schemas/updateTask');
//
// task routes
//

const router = asyncify(express.Router());

router.get('/api/tasks', async (req, res) => {
  const tasks = await getAllTasks();
  const resource = tasks.map((item) => mapper.map(item));

  return res.status(200).json(resource);
});
router.get('/api/tasks/:id', async (req, res) => {
  const task = await getTask(+req.params.id);

  if (!task) {
    throw new httpErrors.NotFoundError('Task not found');
  }
  const resource = mapper.map(task);
  // return resource
  return res.status(200).json(resource);
});

/* POST /api/tasks
   {
     "completed": true
   }
  */
router.post('/api/tasks', validate(taskSchema), async (req, res) => {
  const task = await createTaskCommand.execute(req.body);
  const resource = mapper.map(task);

  return res.status(201).json(resource);
});

/* PATCH /api/tasks/12
   {
     "completed": true
   }
  */
router.patch('/api/tasks/:id', validate(updateTaskSchema), async (req, res) => {
  const oldTask = await getTask(+req.params.id);
  if (!oldTask) {
    throw new httpErrors.NotFoundError('Task not found');
  }
  const newTask = await updateTaskCommand.execute(req.body, +req.params.id);
  const resource = mapper.map(newTask);
  return res.status(200).json(resource);
});

// DELETE /api/tasks/12
router.delete('/api/tasks/:id', async (req, res) => {
  const task = await getTask(+req.params.id);
  if (!task) {
    return res.status(204).json();
  }
  await deleteTaskCommand.execute(+req.params.id);
  const resource = mapper.map(task);
  return res.status(200).json(resource);
});

module.exports = router;
