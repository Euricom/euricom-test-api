const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const sortOn = require('sort-on');
const bodyParser = require('body-parser');
const _ = require('underscore');
const showdown = require('showdown');
const fs = require('fs');
const { ApolloServer } = require('apollo-server-express');

const seed = require('./seed');
const arrayToConnection = require('./graphql/arrayToConnection');
const typeDefs = require('./graphql/typedefs');

// app setup
const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//
// setup data
//
let tasks;
let users;
let products;
let baskets = [];

function generateSeedData() {
  tasks = seed.generateTasks();
  users = seed.generateUsers(50);
  products = seed.generateProducts();
  baskets = [];
}
generateSeedData();

showdown.setFlavor('github');
const converter = new showdown.Converter({
  completeHTMLDocument: true,
});

const resolvers = {
  Mutation: {
    // users
    addOrUpdateUser: (root, { input }) => {
      let user = _.findWhere(users, { id: input.id });
      if (!user) {
        const id = users.reduce((acc, user) => Math.max(acc, user.id), 0) + 1;
        user = { id };
        users.push(user);
      }
      user.firstName = input.firstName;
      user.lastName = input.lastName;
      user.email = input.email;
      user.age = input.age;
      user.company = input.company;
      console.log(user);
      return { user };
    },
    deleteUser: (root, { id }) => {
      const user = users.find(user => user.id == id);
      if (!user) {
        return { user: null };
      }
      users = users.filter(user => user.id !== id);
      return { user };
    },

    // products
    addOrUpdateProduct: (root, { input }) => {
      let product = products.find(product => product.id === input.id);
      if (!product) {
        const id =
          products.reduce((acc, product) => Math.max(acc, product.id), 0) + 1;
        product = { id };
        products.push(product);
      }
      product.sku = input.sku;
      product.title = input.title;
      product.desc = input.desc;
      product.image = input.image;
      product.stock = input.stock;
      product.basePrice = input.basePrice;
      product.price = input.price;
      return { product };
    },
    deleteProduct: (root, { id }) => {
      const product = products.find(product => product.id === id);
      if (!product) {
        return { product: null };
      }
      products = products.filter(product => product.id !== id);
      return { product };
    },

    // tasks
    addTask: (root, { desc }) => {
      const id = tasks.reduce((acc, task) => Math.max(acc, task.id), 0) + 1;
      const task = {
        id,
        desc,
        completed: false,
      };
      tasks.push(task);
      return { task };
    },
    completeTask: (root, { id }) => {
      const task = tasks.find(task => task.id === id);
      if (!task) {
        return { task: null };
      }
      task.completed = true;
      return { task };
    },
    deleteTask: (root, { id }) => {
      const task = tasks.find(task => task.id === id);
      if (!task) {
        return { task: null };
      }
      tasks = tasks.filter(task => task.id !== id);
      return { task };
    },
  },
  Query: {
    task: (_, args) => {
      return tasks.find(task => task.id == args.id);
    },
    tasks: () => tasks,
    user: (_, args) => {
      return users.find(user => user.id == args.id);
    },
    allUsers: () => {
      let sortedUsers = users;
      if (args.orderBy) {
        sortedUsers = sortOn(sortedUsers, args.orderBy);
      }
      return { ...arrayToConnection(sortedUsers, args), user: sortedUsers };
    },
    product: (_, args) => {
      return products.find(product => product.id == args.id);
    },
    allProducts: (_, args) => {
      let sortedProducts = products;
      if (args.orderBy) {
        sortedProducts = sortOn(sortedProducts, args.orderBy);
      }
      return {
        ...arrayToConnection(sortedProducts, args),
        product: sortedProducts,
      };
    },
    basket: () => {
      const basket = getOrCreateBasket('abc');
      return {
        items: basket,
      };
    },
  },
  BasketItem: {
    product: item => {
      const product = products.find(product => product.id === item.id);
      return product;
    },
  },
};

const grapqlServer = new ApolloServer({ typeDefs, resolvers });
grapqlServer.applyMiddleware({ app });

//
// system
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

//
// task routes
//

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});
app.get('/api/tasks/:id', (req, res) => {
  // find user
  const task = _.findWhere(tasks, { id: +req.params.id });
  if (!task) {
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Task not found' });
  }

  // return resource
  return res.json(task);
});

/* POST /api/tasks
   {
     "completed": true
   }
  */
app.post('/api/tasks', (req, res) => {
  // Get resource
  const resource = req.body;
  resource.id = new Date().valueOf();
  resource.completed = false;
  tasks.push(resource);
  res.status(200).json(resource);
});

/* PATCH /api/tasks/12
   {
     "completed": true
   }
  */
app.patch('/api/tasks/:id', (req, res) => {
  // Get resource
  const resource = req.body;
  const task = _.findWhere(tasks, { id: Number(req.params.id) });
  if (!task) {
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Task not found' });
  }

  task.completed = resource.completed;
  return res.status(200).json(task);
});

// DELETE /api/tasks/12
app.delete('/api/tasks/:id', (req, res) => {
  const task = _.findWhere(tasks, { id: Number(req.params.id) });
  if (!task) {
    return res.status(204);
  }

  tasks = _.without(tasks, task);
  return res.status(200).json(task);
});

//
// user routes
//

// GET /api/users
// GET /api/users?page=0&pageSize=10
app.get('/api/users', (req, res) => {
  const page = req.query.page || 0;
  const pageSize = req.query.pageSize || 20;
  console.log('page:', page);
  console.log('pageSize:', pageSize);

  const userSet = _.chain(users)
    .rest(page * pageSize)
    .first(pageSize)
    .value();
  // return all resource
  res.json({
    total: userSet.length,
    users: userSet,
  });
});

// GET /api/users/12
app.get('/api/users/:id', (req, res) => {
  // find user
  const user = _.findWhere(users, { id: +req.params.id });
  if (!user) {
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'User not found' });
  }

  // return resource
  return res.json(user);
});

/* POST /api/users
{
  "firstName": "peter",
  "lastName": "cosemans",
  "age": 52,
  "email": "peter.cosemans@gmail.com",
  "role": "admin"
}
*/
app.post('/api/users', (req, res) => {
  // Get resource
  const resource = req.body;
  console.log('post', req.body);

  // Assign number
  resource.id = new Date().valueOf();

  // Add to users's
  users.push(resource);

  // return resource
  res.status(200).json(resource);
});

/* PUT /api/users/12
{
  "firstName": "peter",
  "lastName": "cosemans",
  "age": 52,
  "email": "peter.cosemans@gmail.com",
  "role": "admin"
}
*/
app.put('/api/users/:id', (req, res) => {
  // Get resource
  const resource = req.body;
  console.log('put', req.body);

  // Find and update
  const user = _.findWhere(users, { id: Number(req.params.id) });
  if (!user) {
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'User not found' });
  }

  user.firstName = resource.firstName;
  user.lastName = resource.lastName;
  user.email = resource.email;
  user.age = Number(resource.age);
  user.company = resource.company;

  return res.status(200).json(user);
});

// DELETE /api/users/12
app.delete('/api/users/:id', (req, res) => {
  const user = _.findWhere(users, { id: Number(req.params.id) });
  if (!user) {
    return res.status(204);
  }

  users = _.without(users, user);
  return res.status(200).json(user);
});

//
// Products
//

// returning products
// GET /api/products
app.get('/api/products', (req, res) => {
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 20;
  const sortExpression = req.query.sort;

  // sort
  console.log(sortExpression);
  let selectedProducts = products;
  if (sortExpression) {
    selectedProducts = sortOn(selectedProducts, sortExpression);
  }

  // skip and take
  selectedProducts = selectedProducts.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  res.json({ total: products.length, page, pageSize, selectedProducts });
});

// get single product by id
// GET /api/products/1
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = _.find(products, { id: id });
  if (!product)
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Product not found' });
  return res.json(product);
});

/* POST /api/products
   {
      "title": "my new product",
      "price": 9.99,
      "stocked": true,
      "desc": "just some text",
      "image": "https://dummyimage.com/300x300.jpg"
   }
*/
app.post('/api/products', (req, res) => {
  // Get resource
  const resource = req.body;
  if (!resource.title || !resource.price) {
    res
      .status(400)
      .json({ code: 'BadRequest', message: 'Missing title and/or price' });
    return;
  }
  // Assign number
  resource.id = new Date().valueOf();

  // Add dummy image when not provided
  if (!resource.image) {
    resource.image = 'https://dummyimage.com/300x300.jpg';
  }

  // Add to users's
  products.push(resource);

  // return resource
  res.status(200).json(resource);
});

/* PUT /api/products/12
  {
    "title": "my new product",
    "price": 9.99,
    "stocked": true,
    "desc": "just some text",
    "image": "https://dummyimage.com/300x300.jpg"
  }
*/
app.put('/api/products/:id', (req, res) => {
  // Get resource
  const resource = req.body;
  console.log('put', req.body);

  // Find and update
  const product = _.findWhere(products, { id: Number(req.params.id) });
  if (!product) {
    return res.json(404, { code: 'NotFound', message: 'Product not found' });
  }

  product.sku = resource.sku;
  product.title = resource.title;
  product.price = resource.price;
  product.basePrice = resource.basePrice;
  product.stocked = resource.stocked;
  product.desc = resource.desc;
  product.image = resource.image;

  return res.status(200).json(product);
});

// DELETE /api/products/1
app.delete('/api/products/:id', (req, res) => {
  const product = _.findWhere(products, { id: Number(req.params.id) });
  if (!product) {
    return res.status(204);
  }

  products = _.without(products, product);
  return res.status(200).json(product);
});

//
// basket
//

function getOrCreateBasket(key) {
  let basket = baskets[key];
  if (!baskets[key]) {
    baskets[key] = [];
    basket = baskets[key];
    basket.push({ id: 1, quantity: 1 });
    basket.push({ id: 3, quantity: 4 });
  }
  return basket;
}

// get basket for session
// GET /api/basket/xyz
app.get('/api/basket/:key', (req, res) => {
  const basket = getOrCreateBasket(req.params.key);
  if (basket.length > 5)
    return res.status(500).json({
      code: 'InteralServerError',
      message: 'Oops, something went wrong',
    });
  res.json(basket);
});

// add product to basket
// POST /api/basket/xyz/product/1
// {
//    quantity: 10
// }
app.post('/api/basket/:key/product/:id', (req, res) => {
  const id = Number(req.params.id);
  const basket = getOrCreateBasket(req.params.key);
  const product = _.find(products, { id: id });
  if (!product)
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Product not found' });
  if (!product.stocked)
    return res
      .status(409)
      .json({ code: 'Conflict', message: 'Product not in stock' });
  let quantity = Math.floor(Number(req.body.quantity) || 1);
  const index = _.findIndex(basket, { id: id });
  if (index < 0) basket.push({ id: id, quantity: quantity });
  if (index >= 0) {
    quantity = (basket[index].quantity || 0) + quantity;
    basket[index].quantity = quantity;
  }
  res.status(201).json(basket);
});

// remove product from basket
// DELETE /api/basket/xyz/product/46
app.delete('/api/basket/:key/product/:id', (req, res) => {
  const id = Number(req.params.id);
  const basket = getOrCreateBasket(req.params.key);
  const index = _.findIndex(basket, { id: id });
  const product = _.find(products, { id: id });
  if (!product || index === -1)
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Product not found' });
  basket.splice(index, 1);
  res.json(basket);
});

// patch quantity of products in basket
// PATH /api/basket/xyz/product/46
// {
//    quantity: 10
// }
app.patch('/api/basket/:key/product/:id', (req, res) => {
  const id = Number(req.params.id);
  const basket = getOrCreateBasket(req.params.key);
  const quantity = Math.floor(Number(req.body.quantity)) || 0;
  const index = _.findIndex(basket, { id: id });
  const product = _.find(products, { id: id });
  if (!product)
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Product not found' });
  if (!product.stocked)
    return res
      .status(409)
      .json({ code: 'Conflict', message: 'Product not in stock' });

  if (index >= 0 && quantity) basket[index].quantity = quantity;
  if (index === -1 && quantity) basket.push({ id: id, quantity: quantity });
  if (quantity == 0) basket.splice(index, 1);

  return res.json(basket);
});

// delete basket
// DELETE /api/basket/xyz
app.delete('/api/basket/:key', (req, res) => {
  const previosBasket = getOrCreateBasket(req.params.key);
  baskets[req.params.key] = []; // clear basket
  res.json(previosBasket);
});

// delete basket (and restore default content)
// DELETE /api/basket/xyz/reset
app.delete('/api/basket/:key/reset', (req, res) => {
  const previosBasket = getOrCreateBasket(req.params.key);
  baskets[req.params.key] = []; // clear basket
  baskets[req.params.key].push({
    id: 1,
    quantity: 1,
  });
  baskets[req.params.key].push({
    id: 3,
    quantity: 4,
  });
  res.json(baskets[req.params.key]);
});

// fallback not found
app.all('/api/*', (req, res) =>
  res.status(404).json({
    code: 'NotFound',
    message: 'Resource not found or method not supprted',
  })
);

//
// listen for requests
//
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(
    `Express server listening on port: http://localhost:${
      server.address().port
    }/api/products`
  );
  console.log(`${grapqlServer.graphqlPath}`);
});
