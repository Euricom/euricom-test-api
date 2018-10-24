const express = require('express');
const validate = require('./middleware/validator');
const sortOn = require('sort-on');
const httpErrors = require('../httpErrors');
const asyncify = require('express-asyncify');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../helpers/productHelper');

const productSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      optional: true,
    },
    sku: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    desc: {
      type: 'string',
      optional: true,
    },
    image: {
      type: 'string',
      optional: true,
    },
    stocked: {
      type: 'boolean',
      optional: true,
    },
    basePrice: {
      type: 'number',
    },
    price: {
      type: 'number',
      optional: true,
    },
  },
};

//
// Products
//

const router = asyncify(express.Router());

// returning products
// GET /api/products

router.get('/api/products', async (req, res) => {
  const products = await getProducts(req, res);
  res.json(products);
});

// get single product by id
// GET /api/products/1
router.get('/api/products/:id', async (req, res) => {
  const product = await getProductById(req, res);
  return res.json(product);
});

/* POST /api/products
   {
      "title": "my new product",
      "price": 9.99,
      "stocked": true,
      "desc": "just some text",
      "image": "https://dummyimage.com/300x300.jpg"
   }
*/
router.post('/api/products', validate(productSchema), async (req, res) => {
  const product = await createProduct(req, res);
  // return resource
  res.status(200).json(product);
});

// /* PUT /api/products/12
//   {
//     "title": "my new product",
//     "price": 9.99,
//     "stocked": true,
//     "desc": "just some text",
//     "image": "https://dummyimage.com/300x300.jpg"
//   }
// */
router.put('/api/products/:id', validate(productSchema), async (req, res) => {
  const product = await updateProduct(req, res);
  return res.status(200).json(product);
});

// // DELETE /api/products/1
router.delete('/api/products/:id', async (req, res) => {
  const product = await deleteProduct(req, res);
  return res.status(200).json(product);
});

module.exports = router;
