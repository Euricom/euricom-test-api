const repository = require('../../../repository/users');

const execute = (userId) => repository.deleteUser(userId);

module.exports = { execute };
