const { createUser } = require('./createUserCommand');
const repository = require('../../../repository/users');

const execute = async (userDTO, userId) => {
  const resource = createUser(userDTO);
  const user = await repository.saveUser(resource, userId);
  return user.value;
};

module.exports = { execute };
