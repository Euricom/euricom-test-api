const express = require('./express');

const { seedProducts } = require('./data/products');
const { seedUsers } = require('./data/users');

const { seedTasks } = require('./data/tasks');

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
const server = express.listen(port, () => {
  console.log(`Express server listening on port: http://localhost:${server.address().port}`);
});
