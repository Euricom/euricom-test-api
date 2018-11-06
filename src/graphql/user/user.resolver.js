const arrayToConnection = require('../arrayToConnection');
const mapper = require('../../api/mappers/userToResource');
const createUserCommand = require('../../domain/commands/users/createUserCommand');
const updateUserCommand = require('../../domain/commands/users/updateUserCommand');
const deleteUserCommand = require('../../domain/commands/users/deleteUserCommand');

const { getAllUsers, getUser } = require('../../repository/users');

const userResolver = {
  Query: {
    user: async (root, args) => {
      const user = await getUser(args.id);
      const resource = mapper.map(user);
      return resource;
    },
    allUsers: async (root, args) => {
      const users = await getAllUsers();
      const resource = users.map((item) => mapper.map(item));
      return {
        ...arrayToConnection(users, args),
        user: resource,
      };
    },
  },
  Mutation: {
    addOrUpdateUser: async (root, { input }) => {
      const oldUser = await getUser(input.id);
      if (!oldUser) {
        const newUser = {
          firstName: input.firstName,
          lastName: input.lastName,
          age: input.age,
          role: input.role,
          email: input.email,
        };
        const user = await createUserCommand.execute(newUser);
        const resource = mapper.map(user);
        return {
          user: resource,
        };
      }
      oldUser.firstName = input.firstName;
      oldUser.lastName = input.lastName;
      oldUser.email = input.email;
      oldUser.age = input.age;
      oldUser.role = input.role;

      const newUser = await updateUserCommand.execute(oldUser, input.id);
      const resource = mapper.map(newUser);
      return {
        user: resource,
      };
    },
    deleteUser: async (root, { id }) => {
      const user = await getUser(id);
      if (!user) {
        return {
          user: null,
        };
      }
      await deleteUserCommand.execute(id);
      const resource = mapper.map(user);
      return {
        user: resource,
      };
    },
  },
};

module.exports = userResolver;
