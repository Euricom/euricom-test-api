/*
* This helper file helps form the json object to return for the REST and Serverless APIs
*/
const { getAllProducts, getProduct, removeProduct, addProduct } = require('../data/products');
const httpErrors = require('../httpErrors');

const getProducts = async (req, res) => {
  console.log(req.query);
  const page = Number(req.query.page) || 0;
  const pageSize = Number(req.query.pageSize) || 20;
  const sortExpression = req.query.sort;

  const products = await getAllProducts();

  let selectedProducts = products;
  if (sortExpression) {
    selectedProducts = sortOn(selectedProducts, sortExpression);
  }

  selectedProducts = selectedProducts.slice(page * pageSize, page * pageSize + pageSize);

  return {
    total: products.length,
    page,
    pageSize,
    selectedProducts,
  };
};

const getProductById = async (req, res) => {
  const id = Number(req.params.id);
  const product = await getProduct(id);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }

  return product;
};

const createProduct = async (req, res) => {
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

  return resource;
};

const updateProduct = async (req, res) => {
  // Get resource
  const resource = req.body;
  console.log('resource', resource);
  // Find and update
  const product = await getProduct(Number(req.params.id));
  console.log(product);
  if (!product) {
    throw new httpErrors.NotFoundError('Product not found');
  }

  resource.id = product.id;
  product.sku = resource.sku;
  product.title = resource.title;
  product.basePrice = resource.basePrice;
  product.price = resource.price || resource.basePrice;
  product.stocked = resource.stocked || false;
  product.desc = resource.desc;
  product.image = resource.image;

  return resource;
};

const deleteProduct = async (req, res) => {
  console.log('deletibg');
  const product = await getProduct(Number(req.params.id));
  if (!product) {
    return res.status(204).json();
  }

  removeProduct(product);

  return product;
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
