const express = require('express');
const asyncify = require('express-asyncify');

const productRepository = require('../../../repository/products');
const basketRepository = require('../../../repository/basket');
const validate = require('../middleware/validator');
const httpErrors = require('../../../httpErrors');
const addProductSchema = require('../../schemas/addProduct');
const mapper = require('../../mappers/basketToResource');
const updateProductInBasketCommand = require('../../../domain/commands/basket/updateProductInBasketCommand');
const removeProductFromBasketCommand = require('../../../domain/commands/basket/removeProductFromBasketCommand');
const clearBasketCommand = require('../../../domain/commands/basket/clearBasketCommand');

const router = asyncify(express.Router());

//
// basket
//

// get basket for session
// GET /api/basket/xyz
router.get('/api/basket/:key', async (req, res) => {
  const basket = await basketRepository.getOrCreateBasket(req.params.key);
  // what does this even mean?z
  // it's a test api, to simulate a 500 error
  if (basket.length > 5) {
    throw new httpErrors.InternalServerError();
  }
  const resource = mapper.map(basket.items);
  return res.json(resource);
});

// add product to basket
// POST /api/basket/xyz/product/1
// {
//    quantity: 10
// }
router.post('/api/basket/:key/product/:id', validate(addProductSchema), async (req, res, next) => {
  const id = Number(req.params.id);
  const quantity = Math.floor(Number(req.body.quantity) || 1);
  const product = await productRepository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  if (!product.stocked) {
    throw new httpErrors.ConflictError('Product not in stock');
  }
  const basket = await updateProductInBasketCommand.execute(req.params.key, id, quantity, true);
  if (!basket) {
    throw new httpErrors.NotFoundError('Basket not found');
  }
  const resource = mapper.map(basket);
  return res.status(201).json(resource);
});

// remove product from basket
// DELETE /api/basket/xyz/product/46
router.delete('/api/basket/:key/product/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await productRepository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  const basket = await removeProductFromBasketCommand.execute(req.params.key, id);
  if (!basket) {
    throw new httpErrors.NotFoundError('Basket not found');
  }
  const resource = mapper.map(basket);
  return res.json(resource);
});

// patch quantity of products in basket
// PATH /api/basket/xyz/product/46
// {
//    quantity: 10
// }
router.patch('/api/basket/:key/product/:id', validate(addProductSchema), async (req, res) => {
  const id = Number(req.params.id);
  const quantity = Math.floor(Number(req.body.quantity) || 0);
  const product = await productRepository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  if (!product.stocked) {
    throw new httpErrors.ConflictError('Product not in stock');
  }
  const basket = await updateProductInBasketCommand.execute(req.params.key, id, quantity, false);
  if (!basket) {
    throw new httpErrors.NotFoundError('Basket not found');
  }
  const resource = mapper.map(basket);
  return res.status(200).json(resource);
});

// delete basket
// DELETE /api/basket/xyz
router.delete('/api/basket/:key', async (req, res) => {
  const basket = await clearBasketCommand.execute(req.params.key);
  const resource = mapper.map(basket);
  return res.json(resource);
});

// delete basket (and restore default content)
// DELETE /api/basket/xyz/reset
router.delete('/api/basket/:key/reset', async (req, res) => {
  const basket = await clearBasketCommand.execute(req.params.key, true);
  const resource = mapper.map(basket);
  return res.json(resource);
});

module.exports = router;
