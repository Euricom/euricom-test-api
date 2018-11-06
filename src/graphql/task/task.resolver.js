const { getAllTasks, getTask } = require('../../repository/tasks');
const mapper = require('../../api/mappers/taskToResource');
const createTaskCommand = require('../../domain/commands/tasks/createTaskCommand');
const updateTaskCommand = require('../../domain/commands/tasks/updateTaskCommand');
const deleteTaskCommand = require('../../domain/commands/tasks/deleteTaskCommand');

const taskResolvers = {
  Query: {
    task: async (root, args) => {
      const task = await getTask(args.id);
      const resource = mapper.map(task);
      return resource;
    },
    tasks: async () => {
      const tasks = await getAllTasks();
      const resource = tasks.map((item) => mapper.map(item));
      return resource;
    },
  },
  Mutation: {
    addTask: async (root, { desc }) => {
      const task = await createTaskCommand.execute({ desc });
      const resource = mapper.map(task);
      return {
        task: resource,
      };
    },
    completeTask: async (root, { id }) => {
      const oldTask = await getTask(id);
      if (!oldTask) {
        return {
          task: null,
        };
      }
      const taskDto = {
        ...oldTask,
        completed: true,
      };
      const newTask = await updateTaskCommand.execute(taskDto, id);
      const resource = mapper.map(newTask);
      return {
        task: resource,
      };
    },
    deleteTask: async (root, { id }) => {
      const task = await getTask(id);
      if (!task) {
        return {
          task: null,
        };
      }
      await deleteTaskCommand.execute(id);
      const resource = mapper.map(task);
      return {
        task: resource,
      };
    },
  },
};

module.exports = taskResolvers;
