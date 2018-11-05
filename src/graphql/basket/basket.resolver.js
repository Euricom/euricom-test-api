const { UserInputError } = require('apollo-server-express');
const { getOrCreateBasket, clearBasket } = require('../../repository/basket');
const { getProduct } = require('../../repository/products');
const mapper = require('../../api/mappers/basketToResource');
const updateProductInBasketCommand = require('../../domain/commands/basket/updateProductInBasketCommand');

const basketResolvers = {
  Query: {
    basket: async (root, { checkoutID }) => {
      let basket = await getOrCreateBasket(checkoutID);
      basket = basket.items.filter((item) => {
        const product = getProduct(item.productId);
        return !!product;
      });
      const resource = mapper.map(basket);
      return {
        checkoutID,
        items: resource,
      };
    },
  },
  BasketItem: {
    product: async (item) => {
      const product = await getProduct(item.productId);
      product.id = product._id;
      delete product._id;
      return product;
    },
  },
  Mutation: {
    addItemToBasket: async (root, args) => {
      const { productId } = args.input.item;
      const { quantity } = args.input.item;
      const product = await getProduct(productId);

      const errors = [];
      if (!product) {
        errors.push({
          key: 'id',
          message: 'Product not found',
        });
      }

      if (product && !product.stocked) {
        errors.push({
          key: 'stocked',
          message: 'Product not in stock',
        });
      }

      if (errors.length) {
        throw new UserInputError('One or more validation(s) failed.', {
          errors,
        });
      }
      const basket = await updateProductInBasketCommand.execute(args.input.checkoutID, productId, quantity, true);

      if (!basket) {
        throw new UserInputError('No basket found');
      }
      const resource = mapper.map(basket);
      return {
        basket: {
          checkoutID: args.input.checkoutID,
          items: resource,
        },
      };
    },

    removeItemFromBasket: async (root, args) => {
      const productId = Number(args.input.productId);
      let basket = await getOrCreateBasket(args.input.checkoutID);
      const index = basket.items.find((item) => item.id === productId);
      if (!index) {
        throw new UserInputError('Product not found');
      }
      basket = basket.items.filter((item) => item.id !== index.id);
      const newBasket = {
        checkoutID: args.input.checkoutID,
        items: basket,
      };
      return {
        basket: newBasket,
      };
    },

    clearBasket: async (root, { checkoutID }) => ({
      basket: {
        checkoutID,
        items: await clearBasket(checkoutID),
      },
    }),
  },
};

module.exports = basketResolvers;
