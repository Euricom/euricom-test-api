const _ = require('underscore');
const seedProducts = require('./productList');

let products = [];

module.exports = {
  clearProducts() {
    products = [];
  },
  seedProducts(count) {
    // count fallback
    if (!count || !Number.isInteger(count)) {
      count = 100;
    }
    // copy from seed products
    for (let i = 0; i < count; i++) {
      products.push(seedProducts[i]);
    }
    return products;
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
