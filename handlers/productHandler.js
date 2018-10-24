const {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../src/helpers/productHelper');

const { seedProducts } = require('../src/data/products');
const validate = require('../src/api/middleware/validator');
const validator = require('validator');
const Joi = require('joi');

seedProducts();

const productSchema = Joi.object().keys({
  id: Joi.number(),
  sku: Joi.string().required(),
  title: Joi.string().required(),
  desc: Joi.string(),
  image: Joi.string(),
  stocked: Joi.bool(),
  basePrice: Joi.number().required(),
  price: Joi.number(),
});

const createResponse = (status, body) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: JSON.stringify(body),
  };
};

const requestValidation = async (event) => {
  const errors = [];
  const validation = Joi.validate(event.body, productSchema, { abortEarly: false });
  if (validation.error) {
    validation.error.details.map((item) => errors.push(item.message.replace(/['"]+/g, '')));
  }
  return errors.length > 0 ? errors : null;
};

module.exports.getAll = async (event, context) => {
  if (event.queryStringParameters) {
    event.query = event.queryStringParameters;
  } else {
    event.query = {};
  }
  const products = await getProducts(event, context);
  return createResponse(200, products);
};

module.exports.getById = async (event, context) => {
  if (!validator.isInt(event.pathParameters.id)) {
    return createResponse(400, { error: 'Id must be a number' });
  }
  event.params = {
    id: event.pathParameters.id,
  };
  try {
    const product = await getProductById(event, context);
    return createResponse(200, product);
  } catch (ex) {
    return createResponse(ex.statusCode, ex.payload);
  }
};

module.exports.create = async (event, context) => {
  event.body = JSON.parse(event.body);
  try {
    const validation = await requestValidation(event);
    if (validation) {
      return createResponse(400, { error: validation });
    }
    const product = await createProduct(event, context);

    return createResponse(201, product);
  } catch (ex) {
    return createResponse(ex.statusCode, ex.payload);
  }
};

module.exports.update = async (event, context) => {
  if (!validator.isInt(event.pathParameters.id)) {
    return createResponse(400, { error: 'Id must be a number' });
  }
  event.params = {
    id: event.pathParameters.id,
  };
  event.body = JSON.parse(event.body);
  try {
    const validation = await requestValidation(event);
    if (validation) {
      return createResponse(400, { error: validation });
    }
    const product = await updateProduct(event, context);

    return createResponse(200, product);
  } catch (ex) {
    return createResponse(ex.statusCode, ex.payload);
  }
};

module.exports.delete = async (event, context) => {
  if (!validator.isInt(event.pathParameters.id)) {
    return createResponse(400, { error: 'Id must be a number' });
  }
  event.params = {
    id: event.pathParameters.id,
  };
  try {
    const product = await deleteProduct(event, context);

    return createResponse(200, product);
  } catch (ex) {
    return createResponse(ex.statusCode, ex.payload);
  }
};
