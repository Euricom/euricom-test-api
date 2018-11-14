require('dotenv').config();
const fs = require('fs');
const express = require('./express');

const productRepository = require('./repository/products');
const taskRepository = require('./repository/tasks');
const userRepository = require('./repository/users');
const db = require('./dbConnection');

const generateSeedData = () => {
  productRepository.clearProducts();
  productRepository.seedProducts(100);
  userRepository.clearUsers();
  userRepository.seedUsers(50);
  taskRepository.clearTasks();
  taskRepository.seedTasks();
};

db.connectToDb()
  .then(() => {
    // make logger dir
    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs');
    }
  })
  .then(() => {
    // seed the application
    generateSeedData();
  })
  .then(() => {
    //
    // listen for requests
    //
    const port = process.env.PORT || 3000;
    const server = express.app.listen(port, () => {
      console.log(`Express server listening on port: http://localhost:${server.address().port}/api/products`);
      console.log(`${express.graphQlServer.graphqlPath}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
