const repository = require('../../../repository/basket');

const execute = async (checkoutID, refill) => {
  const basket = await repository.clearBasket(checkoutID, refill);
  return refill ? basket.ops[0] : basket;
};

module.exports = { execute };
