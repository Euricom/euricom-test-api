const { removeProduct } = require('../../../repository/products');

const execute = async (productId) => {
  return await removeProduct(productId);
};

module.exports = { execute };
