const { removeProduct } = require('../../../repository/products');

const execute = (productId) => removeProduct(productId);

module.exports = { execute };
