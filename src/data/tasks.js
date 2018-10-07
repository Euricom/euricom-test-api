const _ = require('underscore');

let tasks = [];

module.exports = {
  seedTasks() {
    tasks = [
      {
        id: 1,
        desc: 'Drink coffee',
        completed: true,
      },
      {
        id: 2,
        desc: 'Write code',
        completed: false,
      },
      {
        id: 3,
        desc: 'Document work',
        completed: false,
      },
    ];
  },
  getAllTasks() {
    return tasks;
  },
  getTask(id) {
    return tasks.find(task => task.id === id);
  },
  deleteTask(task) {
    tasks = _.without(tasks, task);
    return tasks;
  },
  addUser(task) {
    tasks.push(task);
    return task;
  },
};
