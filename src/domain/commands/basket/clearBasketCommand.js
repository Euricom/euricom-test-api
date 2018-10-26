const repository = require('../../../repository/basket');

const execute = async (checkoutID, refill) => {
  const basket = await repository.clearBasket(checkoutID, refill);
  return basket;
};

module.exports = { execute };
