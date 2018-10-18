const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const sortOn = require('sort-on');
const bodyParser = require('body-parser');
const _ = require('underscore');
const showdown = require('showdown');
const fs = require('fs');
const {
  ApolloServer,
  UserInputError
} = require('apollo-server-express');
const {
  seedProducts,
  getAllProducts,
  getProduct,
  deleteProduct,
  addProduct
} = require('./data/products');

const errorHandler = require('./api/middleware/errorHandler');

const {
  seedUsers,
  getAllUsers,
  getUser,
  deleteUser,
  addUser
} = require('./data/users');

const {
  seedTasks,
  getAllTasks,
  getTask,
  deleteTask,
  addTask
} = require('./data/tasks');



const {
  getOrCreateBasket,
  clearBasket
} = require('./data/basket');

const userRoutes = require('./api/userRoutes');
const taskRoutes = require('./api/taskRoutes');
const productRoutes = require('./api/productRoutes');
const basketRoutes = require('./api/basketRoutes');

const arrayToConnection = require('./graphql/arrayToConnection');
const typeDefs = require('./graphql/typedefs');
const schema = require('./graphql/schema');

// app setup
const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

function generateSeedData() {
  seedProducts();
  seedUsers(50);
  seedTasks();
}
generateSeedData();

showdown.setFlavor('github');
const converter = new showdown.Converter({
  completeHTMLDocument: true,
});

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

const grapqlServer = new ApolloServer({
  schema
});
grapqlServer.applyMiddleware({
  app,
});

//
// REST Routes
//

app.get('/', (req, res) => {
  const text = fs.readFileSync('./api.md', 'utf8');
  console.log(text);
  const html = converter.makeHtml(text);
  console.log(html);
  res.send(html);
});

app.delete('/api/system', (req, res) => {
  generateSeedData();
  res.json({
    code: 200,
    message: 'All the data is resetted',
  });
});

app.use('/', userRoutes);
app.use('/', taskRoutes);
app.use('/', productRoutes);
app.use('/', basketRoutes);

// Error handler
app.use(errorHandler);

// fallback not found
app.all('/api/*', (req, res) =>
  res.status(404).json({
    code: 'NotFound',
    message: 'Resource not found or method not supprted',
  }),
);

//
// listen for requests
//
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Express server listening on port: http://localhost:${server.address().port}/api/products`);
  console.log(`${grapqlServer.graphqlPath}`);
});
