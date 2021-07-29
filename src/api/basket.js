const express = require('express');
const asyncify = require('express-asyncify');

const { getAllProducts, getProduct, deleteProduct, addProduct } = require('../data/products');
const { getOrCreateBasket, clearBasket } = require('../data/basket');
const validate = require('./middleware/validator');
const httpErrors = require('../httpErrors');

const router = asyncify(express.Router());

const addProductSchema = {
  type: 'object',
  properties: {
    quantity: {
      type: 'number',
      optional: true,
    },
  },
};

//
// basket
//

// get basket for session
// GET /api/basket/xyz
router.get('/api/basket/:key', async (req, res) => {
  const basket = await getOrCreateBasket(req.params.key);
  // what does this even mean?z
  // it's a test api, to simulate a 500 error
  if (basket.length > 5) {
    throw new httpErrors.InternalServerError();
  }
  res.json(basket);
});

// add product to basket
// POST /api/basket/xyz/product/1
// {
//    quantity: 10
// }
router.post('/api/basket/:key/product/:id', validate(addProductSchema), async (req, res, next) => {
  const id = Number(req.params.id);
  const basket = await getOrCreateBasket(req.params.key);
  const product = await getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  if (!product.stocked) {
    throw new httpErrors.ConflictError('Product not in stock');
  }

  let quantity = Math.floor(Number(req.body.quantity) || 1);
  const index = basket.find((item) => item.productId === id);

  if (!index) {
    basket.push({
      id: basket.reduce((acc, prop) => Math.max(acc, prop.id), 0) + 1,
      productId: id,
      quantity: quantity,
    });
  } else {
    quantity = (basket[index.id - 1].quantity || 0) + quantity;
    basket[index.id - 1].quantity = quantity;
  }
  res.status(201).json(basket);
});

// remove product from basket
// DELETE /api/basket/xyz/product/46
router.delete('/api/basket/:key/product/:id', async (req, res) => {
  const id = Number(req.params.id);
  const basket = await getOrCreateBasket(req.params.key);
  const index = basket.find((item) => item.productId === id);
  if (!index) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  basket.splice(index.id - 1, 1);
  res.json(basket);
});

// patch quantity of products in basket
// PATH /api/basket/xyz/product/46
// {
//    quantity: 10
// }
router.patch('/api/basket/:key/product/:id', validate(addProductSchema), async (req, res) => {
  const productId = Number(req.params.id);
  let basket = await getOrCreateBasket(req.params.key);
  const quantity = Math.floor(Number(req.body.quantity)) || 0;
  let basketItemIndex;
  const basketItem = basket.find((item, i) => {
    if (item.productId === productId) {
      basketItemIndex = i;
      return item;
    }
  });
  const product = await getProduct(productId);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  if (!product.stocked) {
    throw new httpErrors.ConflictError('Product not in stock');
  }

  if (basketItem && quantity) {
    basket[basketItemIndex].quantity = quantity;
  }
  if (!basketItem && quantity)
    basket.push({
      id: basket.reduce((acc, prop) => Math.max(acc, prop.id), 0) + 1,
      productId,
      quantity: quantity,
    });
  if (quantity == 0) {
    basket = basket.filter((item) => basketItem.id !== item.id);
  }
  return res.json(basket);
});

// delete basket
// DELETE /api/basket/xyz
router.delete('/api/basket/:key', async (req, res) => {
  const previosBasket = await clearBasket(req.params.key);
  res.json(previosBasket);
});

// delete basket (and restore default content)
// DELETE /api/basket/xyz/reset
router.delete('/api/basket/:key/reset', async (req, res) => {
  clearBasket(req.params.key, true);
  const basket = await getOrCreateBasket(req.params.key);
  res.json(basket);
});

module.exports = router;
