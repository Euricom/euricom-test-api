const { seedProducts, getAllProducts, getProduct, deleteProduct, addProduct } = require('../../data/products');
const sortOn = require('sort-on');
const arrayToConnection = require('../arrayToConnection');

const productResolvers = {
  Query: {
    product: (root, args) => {
      return getProduct(args.id);
    },
    allProducts: (root, args) => {
      const products = getAllProducts();
      let sortedProducts = products;
      if (args.orderBy) {
        sortedProducts = sortOn(sortedProducts, args.orderBy);
      }
      return {
        ...arrayToConnection(sortedProducts, args),
        product: sortedProducts,
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
      if (!product) {
        return {
          product: null,
        };
      }
      deleteProduct(product);
      return {
        product,
      };
    },
  },
};

module.exports = productResolvers;
