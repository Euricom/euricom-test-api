const express = require('express');
const asyncify = require('express-asyncify');

const repository = require('../../../repository/products');
const httpErrors = require('../../../httpErrors');
const validate = require('../middleware/validator');
const mapper = require('../../mappers/productToResource');
const productSchema = require('../../schemas/product');
const createProductCommand = require('../../../domain/commands/products/createProductCommand');
const updateProductCommand = require('../../../domain/commands/products/updateProductCommand');
const deleteProductCommand = require('../../../domain/commands/products/deleteProductCommand');
//
// Products
//

const router = asyncify(express.Router());

// returning products
// GET /api/products

router.get('/api/products', async (req, res) => {
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 20;
  const sortExpression = req.query.sort;

  const total = await repository.getProductsCount();
  const products = await repository.getAllProducts(page, pageSize, sortExpression);

  const resource = {
    total,
    page,
    pageSize,
    selectedProducts: products.map((item) => mapper.map(products)),
  };

  return res.json(resource);
});

// // get single product by id
// // GET /api/products/1
router.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await repository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }

  const resource = mapper.map(product);
  //   if (!product) const product = await getProductById(req, res);
  return res.json(resource);
});

// /* POST /api/products
//    {
//       "title": "my new product",
//       "price": 9.99,
//       "stocked": true,
//       "desc": "just some text",
//       "image": "https://dummyimage.com/300x300.jpg"
//    }
// */
router.post('/api/products', validate(productSchema), async (req, res) => {
  const product = await createProductCommand.execute(req.body);
  const resource = mapper.map(product);
  // return resource
  return res.status(201).json(resource);
});

// // /* PUT /api/products/12
// //   {
// //     "title": "my new product",
// //     "price": 9.99,
// //     "stocked": true,
// //     "desc": "just some text",
// //     "image": "https://dummyimage.com/300x300.jpg"
// //   }
// // */
router.put('/api/products/:id', validate(productSchema), async (req, res) => {
  const id = Number(req.params.id);
  const oldProduct = await repository.getProduct(id);
  if (!oldProduct) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  const newProduct = await updateProductCommand.execute(req.body, Number(req.params.id));
  const resource = mapper.map(newProduct);
  return res.status(200).json(resource);
});

// // // DELETE /api/products/1
router.delete('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await repository.getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
  await deleteProductCommand.execute(id);
  const resource = mapper.map(product);
  return res.status(200).json(resource);
});

module.exports = router;
