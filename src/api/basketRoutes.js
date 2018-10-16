const _ = require('underscore');
const express = require('express');

const {
  getAllProducts,
  getProduct,
  deleteProduct,
  addProduct,
} = require('../data/products');
const { getOrCreateBasket, clearBasket } = require('../data/basket');
const validate = require('./middleware/validator');

const router = express.Router();

const addProductSchema = {
  type: 'object',
  properties: {
    quantity: { type: 'number', optional: true },
  },
};

//
// basket
//

// get basket for session
// GET /api/basket/xyz
router.get('/api/basket/:key', (req, res) => {
  const basket = getOrCreateBasket(req.params.key);
  if (basket.length > 5)
    return res.status(500).json({
      code: 'InteralServerError',
      message: 'Oops, something went wrong',
    });
  res.json(basket);
});

// add product to basket
// POST /api/basket/xyz/product/1
// {
//    quantity: 10
// }
router.post(
  '/api/basket/:key/product/:id',
  validate(addProductSchema),
  (req, res) => {
    const id = Number(req.params.id);
    const basket = getOrCreateBasket(req.params.key);
    const product = getProduct(id);
    if (!product)
      return res
        .status(404)
        .json({ code: 'NotFound', message: 'Product not found' });
    if (!product.stocked)
      return res
        .status(409)
        .json({ code: 'Conflict', message: 'Product not in stock' });
    let quantity = Math.floor(Number(req.body.quantity) || 1);
    const index = _.findIndex(basket, { id: id });
    if (index < 0) basket.push({ id: id, quantity: quantity });
    if (index >= 0) {
      quantity = (basket[index].quantity || 0) + quantity;
      basket[index].quantity = quantity;
    }
    res.status(201).json(basket);
  }
);

// remove product from basket
// DELETE /api/basket/xyz/product/46
router.delete('/api/basket/:key/product/:id', (req, res) => {
  const id = Number(req.params.id);
  const basket = getOrCreateBasket(req.params.key);
  const index = _.findIndex(basket, { id: id });
  if (index === -1)
    return res
      .status(404)
      .json({ code: 'NotFound', message: 'Product not found' });
  basket.splice(index, 1);
  res.json(basket);
});

// patch quantity of products in basket
// PATH /api/basket/xyz/product/46
// {
//    quantity: 10
// }
router.patch(
  '/api/basket/:key/product/:id',
  validate(addProductSchema),
  (req, res) => {
    const id = Number(req.params.id);
    const basket = getOrCreateBasket(req.params.key);
    const quantity = Math.floor(Number(req.body.quantity)) || 0;
    const index = _.findIndex(basket, { id: id });
    const product = getProduct(id);
    if (!product)
      return res
        .status(404)
        .json({ code: 'NotFound', message: 'Product not found' });
    if (!product.stocked)
      return res
        .status(409)
        .json({ code: 'Conflict', message: 'Product not in stock' });

    if (index >= 0 && quantity) basket[index].quantity = quantity;
    if (index === -1 && quantity) basket.push({ id: id, quantity: quantity });
    if (quantity == 0) basket.splice(index, 1);

    return res.json(basket);
  }
);

// delete basket
// DELETE /api/basket/xyz
router.delete('/api/basket/:key', (req, res) => {
  const previosBasket = clearBasket(req.params.key);
  res.json(previosBasket);
});

// delete basket (and restore default content)
// DELETE /api/basket/xyz/reset
router.delete('/api/basket/:key/reset', (req, res) => {
  clearBasket(req.params.key, true);
  const basket = getOrCreateBasket(req.params.key);
  res.json(basket);
});

module.exports = router;
