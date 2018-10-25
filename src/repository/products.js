const sortOn = require('sort-on');

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
  getProductsCount() {
    return products.length;
  },
  getAllProducts(page = 0, pageSize = 20, sortExpression = '') {
    console.log(products);
    let selectedProducts = products;
    if (sortExpression) {
      selectedProducts = sortOn(selectedProducts, sortExpression);
    }

    selectedProducts = selectedProducts.slice(page * pageSize, page * pageSize + pageSize);

    return selectedProducts;
  },
  getProduct(id) {
    return products.find((product) => product.id === id);
  },
  removeProduct(productId) {
    products = products.filter((item) => productId !== item.id);
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
  addProducts(products) {
    products.forEach((product) => {
      this.addProduct(product);
    });
  },
};
