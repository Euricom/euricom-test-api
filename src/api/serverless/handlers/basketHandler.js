const middy = require('middy');
const { cors, jsonBodyParser } = require('middy/middlewares');
const updateProductInBasketCommand = require('../../../domain/commands/basket/updateProductInBasketCommand');
const removeProductFromBasketCommand = require('../../../domain/commands/basket/removeProductFromBasketCommand');
const clearBasketCommand = require('../../../domain/commands/basket/clearBasketCommand');
const createResponse = require('../helper');
const basketRepository = require('../../../repository/basket');
const productRepository = require('../../../repository/products');
const mapper = require('../../mappers/basketToResource');
const httpErrors = require('../../../httpErrors');
const httpErrorHandler = require('../../middleware/errorHandler');
const addProductSchema = require('../../schemas/addProduct');
const validator = require('../middleware/validator');

productRepository.seedProducts();
basketRepository.getOrCreateBasket('joswashere');

module.exports.get = middy(async (event) => {
  const basket = await basketRepository.getOrCreateBasket(event.pathParameters.checkoutID);

  if (basket.length > 5) {
    throw new httpErrors.InternalServerError();
  }
  const resource = mapper.map(basket);

  return createResponse(200, resource);
})
  .use(cors())
  .use(httpErrorHandler());

module.exports.addProduct = middy(async (event) => {
  const id = Number(event.pathParameters.productId);
  const quantity = event.body ? Math.floor(Number(event.body.quantity)) : 1;
  const product = await productRepository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  if (!product.stocked) {
    throw new httpErrors.ConflictError('Product not in stock');
  }
  const basket = await updateProductInBasketCommand.execute(event.pathParameters.checkoutID, id, quantity, true);
  if (!basket) {
    throw new httpErrors.NotFoundError('Basket not found');
  }
  const resource = mapper.map(basket);
  return createResponse(201, resource);
})
  .use(cors())
  .use(jsonBodyParser())
  .use(validator(addProductSchema))
  .use(httpErrorHandler());

module.exports.deleteProduct = middy(async (event) => {
  const id = Number(event.pathParameters.productId);
  const product = await productRepository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  const basket = await removeProductFromBasketCommand.execute(event.pathParameters.checkoutID, id);
  if (!basket) {
    throw new httpErrors.NotFoundError('Basket not found');
  }
  const resource = mapper.map(basket);
  return createResponse(200, resource);
})
  .use(cors())
  .use(jsonBodyParser())
  .use(httpErrorHandler());

module.exports.updateProduct = middy(async (event) => {
  const id = Number(event.pathParameters.productId);
  const quantity = event.body ? Math.floor(Number(event.body.quantity)) : 0;
  const product = await productRepository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  if (!product.stocked) {
    throw new httpErrors.ConflictError('Product not in stock');
  }
  const basket = await updateProductInBasketCommand.execute(event.pathParameters.checkoutID, id, quantity, false);
  if (!basket) {
    throw new httpErrors.NotFoundError('Basket not found');
  }
  const resource = mapper.map(basket);
  return createResponse(200, resource);
})
  .use(cors())
  .use(jsonBodyParser())
  .use(validator(addProductSchema))
  .use(httpErrorHandler());
module.exports.clear = middy(async (event) => {
  const basket = await clearBasketCommand.execute(event.pathParameters.checkoutID);
  const resource = mapper.map(basket);
  return createResponse(200, resource);
}).use(cors());
module.exports.reset = middy(async (event) => {
  const basket = await clearBasketCommand.execute(event.pathParameters.checkoutID, true);
  const resource = mapper.map(basket);
  return createResponse(200, resource);
}).use(cors());
