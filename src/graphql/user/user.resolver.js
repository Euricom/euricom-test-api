const arrayToConnection = require('../arrayToConnection');
const sortOn = require('sort-on');
const _ = require('underscore');

const { getAllUsers, getUser, deleteUser } = require('../../data/users');

const userResolver = {
  Query: {
    user: (_, args) => {
      console.log(args);
      return getUser(args.id);
    },
    allUsers: (_, args) => {
      const users = getAllUsers();
      let sortedUsers = users;
      if (args.orderBy) {
        sortedUsers = sortOn(sortedUsers, args.orderBy);
      }
      return {
        ...arrayToConnection(sortedUsers, args),
        user: sortedUsers,
      };
    },
  },
  Mutation: {
    addOrUpdateUser: (root, { input }) => {
      const users = getAllUsers();
      let user = getUser(input.id);
      if (!user) {
        const id = users.reduce((acc, user) => Math.max(acc, user.id), 0) + 1;
        user = {
          id,
        };
        users.push(user);
      }
      user.firstName = input.firstName;
      user.lastName = input.lastName;
      user.email = input.email;
      user.age = input.age;
      user.company = input.company;
      console.log(user);
      return {
        user,
      };
    },
    deleteUser: (root, { id }) => {
      const user = getUser(id);
      if (!user) {
        return {
          user: null,
        };
      }
      deleteUser(user);
      return {
        user,
      };
    },
  },
};

module.exports = userResolver;
