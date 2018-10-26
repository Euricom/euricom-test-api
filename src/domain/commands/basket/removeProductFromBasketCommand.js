const repository = require('../../../repository/basket');

const execute = async (checkoutID, productId) => {
  const basket = await repository.removeProductFromBasket(checkoutID, productId);
  return basket;
};

module.exports = { execute };
