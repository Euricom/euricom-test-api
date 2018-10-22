const {
  getAllTasks,
  getTask,
  addTask,
  deleteTask,
} = require('../../data/tasks');
const _ = require('underscore');

const taskResolvers = {
  Query: {
    task: (_, args) => {
      return getTask(args.id);
    },
    tasks: () => {
      const tasks = getAllTasks();
      return tasks;
    },
  },
  Mutation: {
    addTask: (root, { desc }) => {
      const tasks = getAllTasks();
      const id = tasks.reduce((acc, task) => Math.max(acc, task.id), 0) + 1;
      const task = {
        id,
        desc,
        completed: false,
      };

      addTask(task);
      return {
        task,
      };
    },
    completeTask: (root, { id }) => {
      const task = getTask(id);
      if (!task) {
        return {
          task: null,
        };
      }
      task.completed = true;
      return {
        task,
      };
    },
    deleteTask: (root, { id }) => {
      const task = getTask(id);
      if (!task) {
        return {
          task: null,
        };
      }
      tasks = deleteTask(task);
      return {
        task,
      };
    },
  },
};

module.exports = taskResolvers;
