const { seedProducts, getAllProducts, getProduct, removeProduct, addProduct } = require('../../repository/products');
const sortOn = require('sort-on');
const arrayToConnection = require('../arrayToConnection');

const productResolvers = {
  Query: {
    product: (root, args) => {
      return getProduct(args.id);
    },
    allProducts: (root, args) => {
      const products = getAllProducts(0, 100, args.orderBy);
      console.log(products);
      return {
        ...arrayToConnection(products, args),
        product: products,
      };
    },
  },
  Mutation: {
    addOrUpdateProduct: (root, { input }) => {
      let product = getProduct(input.id);
      const products = getAllProducts();
      if (!product) {
        const id = products.reduce((acc, product) => Math.max(acc, product.id), 0) + 1;
        product = {
          id,
        };
        addProduct(product);
      }
      product.sku = input.sku;
      product.title = input.title;
      product.desc = input.desc;
      product.image = input.image;
      product.stock = input.stock;
      product.basePrice = input.basePrice;
      product.price = input.price;

      return {
        product,
      };
    },
    deleteProduct: (root, { id }) => {
      const product = getProduct(id);
      console.log(product);
      if (!product) {
        return {
          product: null,
        };
      }
      removeProduct(product);
      return {
        product,
      };
    },
  },
};

module.exports = productResolvers;
