const { getOrCreateBasket, clearBasket, removeProductFromBaskets } = require('../../data/basket');
const { UserInputError } = require('apollo-server-express');
const { BusinessRuleError } = require('../errors');

const { seedProducts, getAllProducts, getProduct, deleteProduct, addProduct } = require('../../data/products');

const basketResolvers = {
  Query: {
    basket: (root, { checkoutID }) => {
      let basket = getOrCreateBasket(checkoutID);
      // verify we still have a product for the items
      basket = basket.filter((item) => {
        const product = getProduct(item.productId);
        return !!product;
      });
      return {
        checkoutID,
        items: basket,
      };
    },
  },
  BasketItem: {
    product: (item) => {
      const product = getProduct(item.productId);
      return product;
    },
  },
  Mutation: {
    addItemToBasket: (root, args) => {
      const productId = args.input.item.productId;
      let quantity = args.input.item.quantity;
      const basket = getOrCreateBasket(args.input.checkoutID);
      const product = getProduct(productId);

      let errors = [];
      if (!product) {
        throw new BusinessRuleError('Product not found', 'PRODUCT_NOT_FOUND');
      }

      if (product && !product.stocked) {
        throw new BusinessRuleError('Product not in stock', 'NO_STOCK');
      }

      let basketItem = basket.find((item) => item.productId === productId);
      if (!basketItem) {
        basketItem = {
          id: basket.reduce((acc, item) => Math.max(acc, item.id), 0) + 1,
          productId,
          quantity: 0,
        };
        basket.push(basketItem);
      }
      basketItem.quantity = basketItem.quantity + quantity;
      return {
        basket: {
          checkoutID: args.input.checkoutID,
          items: basket,
        },
      };
    },

    removeItemFromBasket: (root, args) => {
      const productId = Number(args.input.productId);
      let basket = getOrCreateBasket(args.input.checkoutID);
      // item.productId !== index.productId instead of item.id !== index.id to correctly target products
      const index = basket.find((item) => item.productId === productId);
      if (!index) {
        throw new UserInputError('Product not found');
      }

      // this function was declared in basket.js but never used resulting in two different basket arrays between query and mutation
      // when a user tries to delete a product that has been deleted earlier, an error is shown (product not found)
      removeProductFromBaskets(args.input.productId);

      // console.log(index, basket.filter((item) => item.id !== index.id));
      // item.productId !== index.productId instead of item.id !== index.id to correctly target products
      basket = basket.filter((item) => item.productId !== index.productId);
      const newBasket = {
        checkoutID: args.input.checkoutID,
        items: basket,
      };
      return {
        basket: newBasket,
      };
    },

    clearBasket: (root, { checkoutID }) => {
      return {
        basket: {
          checkoutID,
          items: clearBasket(checkoutID),
        },
      };
    },
  },
};

module.exports = basketResolvers;
