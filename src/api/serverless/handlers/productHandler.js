const createProductCommand = require('../../../domain/commands/products/createProductCommand');
const updateProductCommand = require('../../../domain/commands/products/updateProductCommand');
const deleteProductCommand = require('../../../domain/commands/products/deleteProductCommand');
const createResponse = require('../helper');
const repository = require('../../../repository/products');
const mapper = require('../../mappers/productToResource');
const httpErrors = require('../../../httpErrors');
const httpErrorHandler = require('../middleware/errorHandler');
const productSchema = require('../../schemas/product');
const validator = require('../middleware/validator');

const middy = require('middy');
const { cors, jsonBodyParser } = require('middy/middlewares');

repository.seedProducts();

module.exports.getAll = middy(async (event, context) => {
  const page = event.queryStringParameters ? Number(event.queryStringParameters.page) : 0;
  const pageSize = event.queryStringParameters ? Number(event.queryStringParameters.pageSize) : 20;
  const sortExpression = event.queryStringParameters ? event.queryStringParameters.sort : '';

  const total = await repository.getProductsCount();
  const products = await repository.getAllProducts(page, pageSize, sortExpression);

  const resource = {
    total,
    page,
    pageSize,
    seletedProducts: products.map((item) => mapper.map(products)),
  };

  return createResponse(200, resource);
}).use(cors());

module.exports.getById = middy(async (event, context) => {
  const id = Number(event.pathParameters.id);

  const product = await repository.getProduct(id);

  if (!product) {
    throw new httpErrors.NotFoundError(`Product ${id} not found`);
  }
  const resource = mapper.map(product);
  return createResponse(200, resource);
})
  .use(cors())
  .use(httpErrorHandler());

module.exports.create = middy(async (event, context) => {
  const product = await createProductCommand.execute(event.body);
  const resource = mapper.map(product);

  return createResponse(201, resource);
})
  .use(cors())
  .use(jsonBodyParser())
  .use(validator(productSchema))
  .use(httpErrorHandler());

module.exports.update = middy(async (event, context) => {
  const id = Number(event.pathParameters.id);

  const oldProduct = await repository.getProduct(id);

  if (!oldProduct) {
    throw new httpErrors.NotFoundError(`Product ${id} not found`);
  }

  const newProduct = await updateProductCommand.execute(event.body, id);
  const resource = mapper.map(newProduct);

  return createResponse(200, resource);
})
  .use(cors())
  .use(jsonBodyParser())
  .use(validator(productSchema))
  .use(httpErrorHandler());

module.exports.delete = middy(async (event, context) => {
  const id = Number(event.pathParameters.id);
  const product = await repository.getProduct(id);

  if (!product) {
    throw new httpErrors.NotFoundError(`Product ${id} not found`);
  }

  await deleteProductCommand.execute(id);
  const resource = mapper.map(product);
  return createResponse(200, resource);
})
  .use(cors())
  .use(httpErrorHandler());
