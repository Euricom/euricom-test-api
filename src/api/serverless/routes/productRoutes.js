/* eslint-disable no-param-reassign */
const app = require('lambda-api')();
const createProductCommand = require('../../../domain/commands/products/createProductCommand');
const updateProductCommand = require('../../../domain/commands/products/updateProductCommand');
const deleteProductCommand = require('../../../domain/commands/products/deleteProductCommand');
const repository = require('../../../repository/products');
const mapper = require('../../mappers/productToResource');
const httpErrors = require('../../../httpErrors');
const errorHandler = require('../../middleware/errorHandler');
const productSchema = require('../../schemas/product');
const validate = require('../middleware/validator');

app.use((req, res, next) => {
  res.cors();
  next();
});

app.use(errorHandler);

app.get('api/products', async (req, res) => {
  try {
    const page = Number(req.query.page) || 0;
    const pageSize = Number(req.query.pageSize) || 20;
    const sortExpression = req.query.sort;

    const total = await repository.getProductsCount();
    const products = await repository.getAllProducts(page, pageSize, sortExpression);

    const resource = {
      total,
      page,
      pageSize,
      selectedProducts: products.map((item) => mapper.map(item)),
    };
    return res.status(200).json(resource);
  } catch (ex) {
    res.error(ex);
  }
});

app.get('api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await repository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }

  const resource = mapper.map(product);
  return res.status(200).json(resource);
});

app.post('api/products', async (req, res) => {
  const validationError = await validate(productSchema, req.body);
  if (validationError) {
    throw new httpErrors.BadRequestError(validationError);
  }
  const product = await createProductCommand.execute(req.body);
  const resource = mapper.map(product);

  return res.status(201).json(resource);
});

app.put('api/products/:id', async (req, res) => {
  const validationError = await validate(productSchema, req.body);
  if (validationError) {
    throw new httpErrors.BadRequestError(validationError);
  }

  const id = Number(req.params.id);
  const oldProduct = await repository.getProduct(id);
  if (!oldProduct) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  const newProduct = await updateProductCommand.execute(req.body, Number(req.params.id));
  const resource = mapper.map(newProduct.value);
  return res.status(200).json(resource);
});

app.delete('api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await repository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  await deleteProductCommand.execute(id);
  const resource = mapper.map(product);
  return res.status(200).json(resource);
});

module.exports = app;
