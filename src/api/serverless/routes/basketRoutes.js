const app = require('lambda-api')();
const updateProductInBasketCommand = require('../../../domain/commands/basket/updateProductInBasketCommand');
const removeProductFromBasketCommand = require('../../../domain/commands/basket/removeProductFromBasketCommand');
const clearBasketCommand = require('../../../domain/commands/basket/clearBasketCommand');
const basketRepository = require('../../../repository/basket');
const productRepository = require('../../../repository/products');
const mapper = require('../../mappers/basketToResource');
const httpErrors = require('../../../httpErrors');
const errorHandler = require('../../middleware/errorHandler');
const addProductSchema = require('../../schemas/addProduct');
const validate = require('../middleware/validator');

app.use((req, res, next) => {
  res.cors();
  next();
});

app.use(errorHandler);

app.get('api/basket/:key', async (req, res) => {
  try {
    const basket = await basketRepository.getOrCreateBasket(req.params.key);

    if (basket.length > 5) {
      throw new httpErrors.InternalServerError();
    }
    const resource = mapper.map(basket.items);
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

app.post('api/basket/:key/product/:id', async (req, res) => {
  try {
    // serverless doesn't automatically make a body property
    if (!req.body) req.body = {};
    const validationError = await validate(addProductSchema, req.body);
    if (validationError) {
      throw new httpErrors.BadRequestError(validationError);
    }
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
  } catch (ex) {
    res.error(ex);
  }
});

app.delete('api/basket/:key/product/:id', async (req, res) => {
  try {
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
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

app.patch('api/basket/:key/product/:id', async (req, res) => {
  try {
    const validationError = await validate(addProductSchema, req.body);
    if (validationError) {
      throw new httpErrors.BadRequestError(validationError);
    }
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
  } catch (ex) {
    res.error(ex);
  }
});

app.delete('api/basket/:key', async (req, res) => {
  try {
    const basket = await clearBasketCommand.execute(req.params.key);
    const resource = mapper.map(basket.items);
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

app.delete('api/basket/:key/reset', async (req, res) => {
  try {
    const basket = await clearBasketCommand.execute(req.params.key, true);
    const resource = mapper.map(basket.items);
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

module.exports = app;
