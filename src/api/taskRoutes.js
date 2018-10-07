const _ = require('underscore');
const express = require('express');
const { getAllTasks, getTask, deleteTask, addTask } = require('../data/tasks');

//
// task routes
//

const router = express.Router();

router.get('/api/tasks', (req, res) => {
  const tasks = getAllTasks();
  res.json(tasks);
});
router.get('/api/tasks/:id', (req, res) => {
  // find user
  const task = getTask(+req.params.id);
  if (!task) {
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Task not found' });
  }

  // return resource
  return res.json(task);
});

/* POST /api/tasks
   {
     "completed": true
   }
  */
router.post('/api/tasks', (req, res) => {
  // Get resource
  const resource = req.body;
  resource.id = new Date().valueOf();
  resource.completed = false;
  addTask(resource);
  res.status(200).json(resource);
});

/* PATCH /api/tasks/12
   {
     "completed": true
   }
  */
router.patch('/api/tasks/:id', (req, res) => {
  // Get resource
  const resource = req.body;
  const task = getTask(+req.params.id);
  if (!task) {
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Task not found' });
  }

  task.completed = resource.completed;
  return res.status(200).json(task);
});

// DELETE /api/tasks/12
router.delete('/api/tasks/:id', (req, res) => {
  const task = getTask(+req.params.id);
  if (!task) {
    return res.status(204).json();
  }

  tasks = deleteTask(task);
  return res.status(200).json(task);
});

module.exports = router;
