const productList = require('./productList');
const db = require('../dbConnection');

const seedProducts = async (count) => {
  let products = [];
  if (!count || !Number.isInteger(count)) {
    count = 100;
  }
  // copy from seed products
  for (let i = 0; i < count; i++) {
    products.push(productList[i]);
  }
  return await db.collection('products').insertMany(products);
};

const clearProducts = async () => {
  return await db.collection('products').drop();
};

const getProductsCount = async () => {
  return await db.collection('products').countDocuments();
};

const getAllProducts = async (page = 0, pageSize = 20, sortExpression = 'id') => {
  let sortProperty;
  let sortDirection;

  if (sortExpression) {
    if (sortExpression.indexOf('-', 0) === -1) {
      sortProperty = sortExpression;
      sortDirection = 1;
    } else {
      sortProperty = sortExpression.slice(1, sortExpression.length);
      sortDirection = -1;
    }
  }

  let products = await db
    .collection('products')
    .find({})
    .sort(sortProperty, sortDirection)
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  return products;
};

const getProduct = async (id) => {
  return await db.collection('products').findOne({ _id: id });
};

const removeProduct = async (id) => {
  return await db.collection('products').remove({ _id: id });
};

const addProduct = async (product) => {
  if (!product.price) {
    product.price = product.basePrice;
  }
  if (!product.stocked) {
    product.stocked = false;
  }
  return await db.collection('products').insertOne(product);
};

const saveProduct = async (product, id) => {
  return await db.collection('products').findOneAndReplace({ _id: id }, product, { returnOriginal: false });
};

const addProducts = async (products) => {
  return await db.collection('products').insert(products);
};

module.exports = {
  clearProducts,
  seedProducts,
  getProductsCount,
  getAllProducts,
  getProduct,
  removeProduct,
  addProduct,
  addProducts,
  saveProduct,
};
