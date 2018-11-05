const { getAllProducts, getProduct } = require('../../repository/products');
const arrayToConnection = require('../arrayToConnection');
const mapper = require('../../api/mappers/productToResource');
const createProductCommand = require('../../domain/commands/products/createProductCommand');
const updateProductCommand = require('../../domain/commands/products/updateProductCommand');
const deleteProductCommand = require('../../domain/commands/products/deleteProductCommand');

const productResolvers = {
  Query: {
    product: async (root, args) => {
      const product = await getProduct(args.id);
      const resource = mapper.map(product);
      return resource;
    },
    allProducts: async (root, args) => {
      const products = await getAllProducts(0, 100, args.orderBy);
      return {
        ...arrayToConnection(products, args),
        product: products.map((item) => mapper.map(item)),
      };
    },
  },
  Mutation: {
    addOrUpdateProduct: async (root, { input }) => {
      const oldProduct = await getProduct(input.id);
      if (!oldProduct) {
        const newProduct = {
          sku: input.sku,
          title: input.title,
          desc: input.desc,
          stocked: input.stocked,
          basePrice: input.basePrice,
          price: input.price,
          image: input.image,
        };
        const product = await createProductCommand.execute(newProduct);
        const resource = mapper.map(product);
        return {
          product: resource,
        };
      }
      oldProduct.sku = input.sku;
      oldProduct.title = input.title;
      oldProduct.desc = input.desc;
      oldProduct.image = input.image;
      oldProduct.stock = input.stock;
      oldProduct.basePrice = input.basePrice;
      oldProduct.price = input.price;

      const newProduct = await updateProductCommand.execute(oldProduct, input.id);
      const resource = mapper.map(newProduct.value);
      return {
        product: resource,
      };
    },
    deleteProduct: async (root, { id }) => {
      const product = await getProduct(id);
      if (!product) {
        return {
          product: null,
        };
      }
      await deleteProductCommand.execute(id);
      const resource = mapper.map(product);
      return { product: resource };
    },
  },
};

module.exports = productResolvers;
