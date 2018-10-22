const express = require('express');
const validate = require('./middleware/validator');
const sortOn = require('sort-on');
const httpErrors = require('../httpErrors');
const asyncify = require('express-asyncify');

const {
  getAllProducts,
  getProduct,
  deleteProduct,
  addProduct,
} = require('../data/products');

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
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 20;
  const sortExpression = req.query.sort;

  // sort
  console.log(sortExpression);
  const products = await getAllProducts();
  let selectedProducts = products;
  if (sortExpression) {
    selectedProducts = sortOn(selectedProducts, sortExpression);
  }

  // skip and take
  selectedProducts = selectedProducts.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  res.json({
    total: products.length,
    page,
    pageSize,
    selectedProducts,
  });
});

// get single product by id
// GET /api/products/1
router.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  const product = await getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }
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
  // Get resource
  const resource = req.body;

  // Assign number
  resource.id = new Date().valueOf();

  // Add dummy image when not provided
  if (!resource.image) {
    resource.image = 'https://dummyimage.com/300x300.jpg';
  }

  // Add to users's
  await addProduct(resource);

  // return resource
  res.status(200).json(resource);
});

/* PUT /api/products/12
  {
    "title": "my new product",
    "price": 9.99,
    "stocked": true,
    "desc": "just some text",
    "image": "https://dummyimage.com/300x300.jpg"
  }
*/
router.put('/api/products/:id', validate(productSchema), async (req, res) => {
  // Get resource
  const resource = req.body;

  // Find and update
  const product = await getProduct(Number(req.params.id));
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }

  product.sku = resource.sku;
  product.title = resource.title;
  product.basePrice = resource.basePrice;
  product.price = resource.price || resource.basePrice;
  product.stocked = resource.stocked || false;
  product.desc = resource.desc;
  product.image = resource.image;

  return res.status(200).json(product);
});

// DELETE /api/products/1
router.delete('/api/products/:id', async (req, res) => {
  const product = await getProduct(Number(req.params.id));
  if (!product) {
    return res.status(204).json();
  }

  deleteProduct(product);
  return res.status(200).json(product);
});

module.exports = router;
