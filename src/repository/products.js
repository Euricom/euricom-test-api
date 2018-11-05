const productList = require('./productList');
const db = require('../dbConnection');

const seedProducts = async (count) => {
  const products = [];
  let productCount = count;
  if (!productCount || !Number.isInteger(productCount)) {
    productCount = 100;
  }
  // copy from seed products
  for (let i = 0; i < productCount; i += 1) {
    products.push(productList[i]);
  }
  return db.collection('products').insertMany(products);
};

const clearProducts = async () => db.collection('products').drop();

const getProductsCount = async () => db.collection('products').countDocuments();

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

  const products = await db
    .collection('products')
    .find({})
    .sort(sortProperty, sortDirection)
    .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

  return products;
};

const getProduct = (id) => db.collection('products').findOne({ _id: id });

const removeProduct = (id) => db.collection('products').remove({ _id: id });

const addProduct = (product) => db.collection('products').insertOne(product);

const saveProduct = (product, id) =>
  db.collection('products').findOneAndReplace({ _id: id }, product, { returnOriginal: false });

// helper function for int tests
const addProducts = (products) => db.collection('products').insert(products);

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
