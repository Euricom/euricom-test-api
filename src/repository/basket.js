const db = require('../dbConnection');

const baskets = [];

const seedBasket = (checkoutID) => {
  const basket = {
    checkoutID,
    items: [
      {
        id: 1,
        productId: 1,
        quantity: 1,
      },
      {
        id: 2,
        productId: 2,
        quantity: 4,
      },
    ],
  };

  return db.collection('baskets').insertOne(basket);
};

const getOrCreateBasket = async (checkoutID) => {
  const basket = await db.collection('baskets').findOne({ checkoutID });
  if (!basket) {
    return seedBasket(checkoutID);
  }
  return basket;
};

const changeProductQuantity = (checkoutID, product, productId, quantity, isCreating) => {
  const basketMaxId = baskets[checkoutID].reduce((acc, item) => Math.max(acc, item.id), 0);
  if (!product) {
    baskets[checkoutID].push({
      id: basketMaxId + 1,
      quantity,
      productId,
    });
  } else {
    isCreating ? (quantity = (baskets[checkoutID][product.id - 1].quantity || 0) + quantity) : null; //eslint-disable-line
    baskets[checkoutID][product.id - 1].quantity = quantity;
  }
};

const updateProductInBasket = (checkoutID, productId, quantity, isCreating) => {
  if (baskets[checkoutID]) {
    const product = baskets[checkoutID].find((item) => item.productId === productId);
    changeProductQuantity(checkoutID, product, productId, quantity, isCreating);
    return baskets[checkoutID];
  }
};

const removeProductFromBasket = (checkoutID, productId) => baskets[checkoutID]
    ? (baskets[checkoutID] = baskets[checkoutID].filter((product) => product.id !== productId))
    : baskets[checkoutID];

module.exports = {
  removeProductFromBasket,
  updateProductInBasket,
  seedBasket,
  getOrCreateBasket,
  clearBasket(checkoutID, refill = false) {
    const previousBasket = getOrCreateBasket(checkoutID);
    baskets[checkoutID] = []; // clear basket
    if (refill) {
      baskets[checkoutID].push({
        id: 1,
        productId: 1,
        quantity: 1,
      });
      baskets[checkoutID].push({
        id: 2,
        productId: 2,
        quantity: 4,
      });
    }
    return previousBasket;
  },
};
