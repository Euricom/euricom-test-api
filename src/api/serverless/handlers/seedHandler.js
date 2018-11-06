/* eslint-disable no-param-reassign */

const productRepository = require('../../../repository/products');
const basketRepository = require('../../../repository/basket');
const { withDb } = require('../helper');

// eslint-disable-next-line
const handler = async (event, context) => {
  const seedCount = Number(event.seedCount);
  await productRepository.clearProducts();
  // event.seedCount should be a number for #-products to seed
  await productRepository.seedProducts(seedCount);
  await basketRepository.getOrCreateBasket('joswashere');
  return 'Seeded Database';
};

module.exports.handler = withDb(handler);
