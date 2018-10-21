const express = require('./express');
const _ = require('underscore');

const {
  seedProducts,
} = require('./data/products');
const {
  seedUsers,
} = require('./data/users');

const {
  seedTasks,
} = require('./data/tasks');

function generateSeedData() {
  seedProducts();
  seedUsers(50);
  seedTasks();
}
generateSeedData();

// const resolvers = {
//   Mutation: {
//     // users
//     addOrUpdateUser: (root, { input }) => {
//       let user = getUser(input.id);
//       if (!user) {
//         const id = users.reduce((acc, user) => Math.max(acc, user.id), 0) + 1;
//         user = {
//           id,
//         };
//         users.push(user);
//       }
//       user.firstName = input.firstName;
//       user.lastName = input.lastName;
//       user.email = input.email;
//       user.age = input.age;
//       user.company = input.company;
//       console.log(user);
//       return {
//         user,
//       };
//     },
//     deleteUser: (root, { id }) => {
//       const user = getUser(id);
//       if (!user) {
//         return {
//           user: null,
//         };
//       }
//       deleteUser(user);
//       return {
//         user,
//       };
//     },

//     // products

//     // basket
//     addItemToBasket: (root, args) => {
//       console.log('addItemToBasket', args);
//       const productId = args.input.item.productId;
//       let quantity = args.input.item.quantity;
//       const basket = getOrCreateBasket(args.input.checkoutID);
//       const product = getProduct(productId);

//       let errors = [];
//       if (!product)
//         errors.push({
//           key: 'id',
//           message: 'Product not found',
//         });

//       if (!product.stocked)
//         errors.push({
//           key: 'stocked',
//           message: 'Product not in stock',
//         });

//       if (errors.length) {
//         throw new UserInputError('One or more validation failed.', {
//           errors,
//         });
//       }

//       let basketItem = basket.find((item) => item.productId === productId);
//       if (!basketItem) {
//         basketItem = {
//           id: basket.reduce((acc, item) => Math.max(acc, item.id), 0) + 1,
//           productId,
//           quantity: 0,
//         };
//         basket.push(basketItem);
//       }
//       basketItem.quantity = basketItem.quantity + quantity;
//       return { basket: { checkoutID: args.input.checkoutID, items: basket } };
//     },

//     removeItemFromBasket: (root, args) => {
//       console.log('removeItemsFromBasket', args);

//       const productId = Number(args.input.productId);
//       const basket = getOrCreateBasket(args.input.checkoutID);
//       const index = _.findIndex(basket, { productId: productId });
//       if (index === -1) {
//         throw new UserInputError('Product not found');
//       }
//       basket.splice(index, 1);
//       const newBasket = {
//         checkoutID: args.input.checkoutID,
//         items: basket,
//       };
//       return {
//         basket: newBasket,
//       };
//     },

//     clearBasket: (root, { checkoutID }) => {
//       return {
//         basket: {
//           checkoutID,
//           items: clearBasket(checkoutID),
//         },
//       };
//     },

//     // tasks
//     addTask: (root, { desc }) => {
//       const id = tasks.reduce((acc, task) => Math.max(acc, task.id), 0) + 1;
//       const task = {
//         id,
//         desc,
//         completed: false,
//       };
//       addTask(task);
//       return {
//         task,
//       };
//     },
//     completeTask: (root, { id }) => {
//       const task = getTask(id);
//       if (!task) {
//         return {
//           task: null,
//         };
//       }
//       task.completed = true;
//       return {
//         task,
//       };
//     },
//     deleteTask: (root, { id }) => {
//       const task = getTask(id);
//       if (!task) {
//         return {
//           task: null,
//         };
//       }
//       tasks = deleteTask(task);
//       return {
//         task,
//       };
//     },
//   },
//   Query: {
//     task: (_, args) => {
//       return getTask(args.id);
//     },
//     tasks: () => {
//       const tasks = getAllTasks();
//       return tasks;
//     },
//     user: (_, args) => {
//       return getUser(args.id);
//     },
//     allUsers: () => {
//       const users = getAllUsers();
//       let sortedUsers = users;
//       if (args.orderBy) {
//         sortedUsers = sortOn(sortedUsers, args.orderBy);
//       }
//       return {
//         ...arrayToConnection(sortedUsers, args),
//         user: sortedUsers,
//       };
//     },
//     basket: (_, { checkoutID }) => {
//       let basket = getOrCreateBasket(checkoutID);
//       // verify we still have a product for the items
//       basket = basket.filter((item) => {
//         const product = getProduct(item.productId);
//         return !!product;
//       });
//       return {
//         checkoutID,
//         items: basket,
//       };
//     },
//   },
//   BasketItem: {
//     product: (item) => {
//       const product = getProduct(item.productId);
//       return product;
//     },
//   },
// };





//
// listen for requests
//
const port = process.env.PORT || 3000;
const server = express.app.listen(port, () => {
  console.log(
    `Express server listening on port: http://localhost:${
      server.address().port
    }/api/products`,
  );
  console.log(`${express.graphQlServer.graphqlPath}`);
});
