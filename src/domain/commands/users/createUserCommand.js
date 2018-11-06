const repository = require('../../../repository/users');

const createUser = (userDTO) => ({ ...userDTO });

const execute = async (userDTO) => {
  const user = await createUser(userDTO);
  await repository.addUser(user);
  return user;
};

module.exports = { execute, createUser };
