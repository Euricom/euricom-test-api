const { createProduct } = require('./createProductCommand');
const { getProduct } = require('../../../repository/products');

const execute = async (productDTO, productId) => {
  const resource = createProduct(productDTO);
  const product = await getProduct(productId);

  product.sku = resource.sku;
  product.title = resource.title;
  product.basePrice = resource.basePrice;
  product.price = resource.price;
  product.stocked = resource.stocked;
  product.desc = resource.desc;
  product.image = resource.image;

  return product;
};

module.exports = { execute };
