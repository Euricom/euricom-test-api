const repository = require('../../../repository/tasks');

const execute = (taskId) => repository.deleteTask(taskId);

module.exports = { execute };
