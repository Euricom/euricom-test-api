const { getOrCreateBasket, clearBasket } = require('../../data/basket');

const {
  seedProducts,
  getAllProducts,
  getProduct,
  deleteProduct,
  addProduct,
} = require('../../data/products');

const basketResolvers = {
  Query: {
    basket: (_, { checkoutID }) => {
      let basket = getOrCreateBasket(checkoutID);
      // verify we still have a product for the items
      basket = basket.filter((item) => {
        const product = getProduct(item.productId);
        return !!product;
      });
      console.log('basket', basket);
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
      console.log('addItemToBasket', args);
      const productId = args.input.item.productId;
      let quantity = args.input.item.quantity;
      const basket = getOrCreateBasket(args.input.checkoutID);
      const product = getProduct(productId);

      let errors = [];
      if (!product)
        errors.push({
          key: 'id',
          message: 'Product not found',
        });

      if (!product.stocked)
        errors.push({
          key: 'stocked',
          message: 'Product not in stock',
        });

      if (errors.length) {
        throw new UserInputError('One or more validation failed.', {
          errors,
        });
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
      console.log('removeItemsFromBasket', args);

      const productId = Number(args.input.productId);
      const basket = getOrCreateBasket(args.input.checkoutID);
      const index = _.findIndex(basket, {
        productId: productId,
      });
      if (index === -1) {
        throw new UserInputError('Product not found');
      }
      basket.splice(index, 1);
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
