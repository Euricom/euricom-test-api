const _ = require('underscore');

let baskets = [];

function getOrCreateBasket(checkoutID) {
  console.log('checkoutID', checkoutID);
  let basket = baskets[checkoutID];
  if (!baskets[checkoutID]) {
    baskets[checkoutID] = [];
    basket = baskets[checkoutID];
    basket.push({
      id: 1,
      productId: 1,
      quantity: 1,
    });
    basket.push({
      id: 2,
      productId: 2,
      quantity: 4,
    });
  }
  return basket;
}

module.exports = {
  seedBasket() {},
  getOrCreateBasket,
  clearBasket(checkoutID, refill = false) {
    const previosBasket = getOrCreateBasket(checkoutID);
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
    return previosBasket;
  },
};
