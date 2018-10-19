const _ = require('underscore');
const seedProducts = require('./productList');

let products = [];

module.exports = {
  clearProducts() {
    products = [];
  },
  seedProducts() {
    // copy from seed products
    products = JSON.parse(JSON.stringify(seedProducts));
  },
  getAllProducts() {
    return products;
  },
  getProduct(id) {
    return products.find((product) => product.id === id);
  },
  deleteProduct(product) {
    products = _.without(products, product);
    return products;
  },
  addProduct(product) {
    if (!product.price) {
      product.price = product.basePrice;
    }
    if (!product.stocked) {
      product.stocked = false;
    }
    products.push(product);
    return product;
  },
};
