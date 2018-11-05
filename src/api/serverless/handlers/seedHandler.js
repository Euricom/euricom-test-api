/* eslint-disable no-param-reassign */

const db = require('../../../dbConnection');
const productRepository = require('../../../repository/products');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await db.connectToDb();
    await productRepository.clearProducts();
    await productRepository.seedProducts(event);
    return 'Seeded Database';
  } catch (ex) {
    return ex;
  }
};
