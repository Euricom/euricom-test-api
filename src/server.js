const express = require('./express');

const { seedProducts } = require('./repository/products');
const { seedUsers } = require('./repository/users');

const { seedTasks } = require('./repository/tasks');

function generateSeedData() {
  seedProducts();
  seedUsers(50);
  seedTasks();
}
generateSeedData();

//
// listen for requests
//
const port = process.env.PORT || 3000;
const server = express.app.listen(port, () => {
  console.log(`Express server listening on port: http://localhost:${server.address().port}/api/products`);
  console.log(`${express.graphQlServer.graphqlPath}`);
});
