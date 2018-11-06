const { createTask } = require('./createTaskCommand');
const repository = require('../../../repository/tasks');

const execute = async (taskDTO, taskId) => {
  const resource = createTask(taskDTO);
  const task = await repository.saveTask(resource, taskId);
  return task.value;
};

module.exports = { execute };
