require('dotenv').config();
const express = require('./express');

const productRepository = require('./repository/products');
const { seedUsers } = require('./repository/users');

const { seedTasks } = require('./repository/tasks');
const db = require('./dbConnection');

const generateSeedData = () => {
  productRepository.clearProducts();
  productRepository.seedProducts(100);
  // seedUsers(50);
  // seedTasks();
};

db.connectToDb()
  .then(() => {
    // seed the application
    generateSeedData();
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
