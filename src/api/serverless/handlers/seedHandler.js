/* eslint-disable no-param-reassign */

const productRepository = require('../../../repository/products');
const basketRepository = require('../../../repository/basket');
const taskRepository = require('../../../repository/tasks');
const userRepository = require('../../../repository/users');
const { withDb, createError } = require('../helper');
const db = require('../../../dbConnection');

// This is the seed handler purely for populating the database for testing purpose, invoke at own risk
// eslint-disable-next-line
const handler = async (event, context) => {
  try {
    const productCount = Number(event.productCount) || null;
    const userCount = Number(event.userCount) || null;
    const basketKey = event.basketKey || 'joswashere';
    await db.dropDb();
    await productRepository.seedProducts(productCount);
    await basketRepository.getOrCreateBasket(basketKey);
    await taskRepository.seedTasks();
    await userRepository.seedUsers(userCount);
    return 'Seeded Database';
  } catch (ex) {
    return createError(ex.status, ex.stack);
  }
};

module.exports.handler = withDb(handler);
