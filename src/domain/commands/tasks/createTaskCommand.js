const repository = require('../../../repository/tasks');

const createTask = (taskDTO) => {
  const task = {
    desc: taskDTO.desc,
    completed: taskDTO.completed || false,
  };
  return task;
};

const execute = async (taskDTO) => {
  const task = await createTask(taskDTO);
  await repository.addTask(task);
  return task;
};

module.exports = { execute, createTask };
