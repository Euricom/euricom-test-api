let baskets = [];

const getOrCreateBasket = (checkoutID) => {
  let basket = baskets[checkoutID];
  if (!baskets[checkoutID]) {
    baskets[checkoutID] = [];
    return seedBasket(checkoutID);
  }
  return basket;
};

const updateProductInBasket = (checkoutID, productId, quantity, isCreating) => {
  if (baskets[checkoutID]) {
    const product = baskets[checkoutID].find((product) => product.productId === productId);
    changeProductQuantity(checkoutID, product, productId, quantity, isCreating);
    return baskets[checkoutID];
  }
  return;
};

const changeProductQuantity = (checkoutID, product, productId, quantity, isCreating) => {
  const basketMaxId = baskets[checkoutID].reduce((acc, item) => Math.max(acc, item.id), 0);
  if (!product) {
    baskets[checkoutID].push({
      id: basketMaxId + 1,
      quantity: quantity,
      productId: productId,
    });
  } else {
    isCreating ? (quantity = (baskets[checkoutID][product.id - 1].quantity || 0) + quantity) : null;
    baskets[checkoutID][product.id - 1].quantity = quantity;
  }
};

const removeProductFromBasket = (checkoutID, productId) => {
  return baskets[checkoutID]
    ? (baskets[checkoutID] = baskets[checkoutID].filter((product) => product.id !== productId))
    : baskets[checkoutID];
};

const seedBasket = (checkoutID) => {
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
  return baskets[checkoutID];
};

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
