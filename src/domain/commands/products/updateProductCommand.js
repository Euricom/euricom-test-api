const { createProduct } = require('./createProductCommand');
const { saveProduct } = require('../../../repository/products');

const execute = async (productDTO, productId) => {
  const resource = createProduct(productDTO);
  const product = await saveProduct(resource, productId);
  return product.value;
};

module.exports = { execute };
