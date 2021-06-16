const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const sortOn = require('sort-on');
const bodyParser = require('body-parser');
const fs = require('fs');
const asyncify = require('express-asyncify');
const { ApolloServer, UserInputError } = require('apollo-server-express');
const showdown = require('showdown');

const usersApi = require('./api/users');
const tasksApi = require('./api/tasks');
const productsApi = require('./api/products');
const basketApi = require('./api/basket');

const errorHandler = require('./api/middleware/errorHandler');
const schema = require('./graphql/schema');

showdown.setFlavor('github');
const converter = new showdown.Converter({
  completeHTMLDocument: true,
});

// app setup
const app = asyncify(express());
app.use(morgan('dev'));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//
// REST Routes
//

app.get('/', async (req, res) => {
  const text = fs.readFileSync('./api.md', 'utf8');
  const html = converter.makeHtml(text);
  res.send(html);
});

app.delete('/api/system', async (req, res) => {
  generateSeedData();
  res.json({
    code: 200,
    message: 'All the data is resetted',
  });
});

app.use('/', usersApi);
app.use('/', tasksApi);
app.use('/', productsApi);
app.use('/', basketApi);

// Error handler
app.use(errorHandler);

// fallback not found
app.all('/api/*', async (req, res) =>
  res.status(404).json({
    code: 'NotFound',
    message: 'Resource not found or method not supprted',
  }),
);

const graphQlServer = new ApolloServer({
  schema,
  formatError: (error) => {
    // console.log(error);
    // return new Error('Internal server error');
    // Or, you can delete the exception information
    // delete error.extensions.exception;
    return error;
  },
  introspection: true,
  playground: true,
});
graphQlServer.applyMiddleware({
  app,
});

module.exports = app;
