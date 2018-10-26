const repository = require('../../../repository/basket');

const execute = async (checkoutID, productId, quantity, isCreating) => {
  const basket = await repository.updateProductInBasket(checkoutID, productId, quantity, isCreating);
  return basket;
};

module.exports = { execute };
