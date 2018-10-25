const { addProduct } = require('../../../repository/products');

const createProduct = (productDTO) => {
  const product = {
    sku: productDTO.sku,
    title: productDTO.title,
    desc: productDTO.desc,
    price: productDTO.price || productDTO.basePrice,
    basePrice: productDTO.basePrice,
    stocked: productDTO.stocked || false,
    image: productDTO.image || 'https://dummyimage.com/300x300.jpg',
  };
  return product;
};

const execute = async (productDTO) => {
  const product = createProduct(productDTO);
  product.id = new Date().valueOf();
  await addProduct(product);

  return product;
};

module.exports = { execute, createProduct };
