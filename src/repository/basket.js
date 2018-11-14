const db = require('../dbConnection');

const seedBasket = async (checkoutID) => {
  const seedBaskets = {
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
  return db.collection('baskets').insertOne(seedBaskets);
};

const getOrCreateBasket = async (checkoutID, clear) => {
  const basket = await db.collection('baskets').findOne({ checkoutID });
  if (!basket && !clear) {
    const newBasket = await seedBasket(checkoutID);
    return newBasket.ops[0];
  }
  return basket;
};

const updateBasketItems = async (checkoutID, productId, quantity, basket, item) => {
  if (item) {
    basket.items = basket.items.map((basketItem) => {
      if (basketItem.productId === productId) {
        basketItem.quantity += quantity;
      }
      return basketItem;
    });
  } else {
    const basketItem = {
      productId,
      quantity,
      id: basket.items.reduce((acc, prop) => Math.max(acc, prop.id), 0) + 1,
    };
    basket.items.push(basketItem);
  }
  const newBasket = await db.collection('baskets').findOneAndReplace({ checkoutID }, basket, { returnOriginal: false });
  return newBasket.value;
};

const changeProductQuantity = async (checkoutID, productId, quantity, basket, item) => {
  if (quantity === 0) {
    if (item) {
      basket.items = basket.items.filter((basketItem) => basketItem.productId !== productId);
    }

    const newBasket = await db
      .collection('baskets')
      .findOneAndReplace({ checkoutID }, basket, { returnOriginal: false });
    return newBasket.value;
  }
  if (item) {
    basket.items = basket.items.map((basketItem) => {
      if (basketItem.productId === productId) {
        basketItem.quantity = quantity;
      }
      return basketItem;
    });
    const newBasket = await db
      .collection('baskets')
      .findOneAndReplace({ checkoutID }, basket, { returnOriginal: false });
    return newBasket.value;
  }
};

const updateProductInBasket = async (checkoutID, productId, quantity, isCreating) => {
  const basket = await getOrCreateBasket(checkoutID);
  const item = basket.items.find((basketItem) => basketItem.productId === productId);

  if (isCreating) {
    await updateBasketItems(checkoutID, productId, quantity, basket, item);
  }
  await changeProductQuantity(checkoutID, productId, quantity, basket, item);
  return basket;
};

const removeProductFromBasket = async (checkoutID, productId) => {
  const basket = await db.collection('baskets').findOne({ checkoutID });

  basket.items = basket.items.filter((item) => item.productId !== productId);

  const newBasket = await db.collection('baskets').findOneAndReplace({ checkoutID }, basket, { returnOriginal: false });
  return newBasket.value;
};

const clearBasket = async (checkoutID, refill = false) => {
  const previousBasket = await getOrCreateBasket(checkoutID, true);
  await db.collection('baskets').deleteOne({ checkoutID });
  if (refill) {
    return seedBasket(checkoutID);
  }
  return previousBasket;
};

module.exports = {
  removeProductFromBasket,
  updateProductInBasket,
  seedBasket,
  getOrCreateBasket,
  clearBasket,
};
