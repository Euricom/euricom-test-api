const { handler } = require('../src/api/serverless/handlers/productHandler');
const { withParse } = require('../src/api/serverless/helper');
const db = require('../src/dbConnection');

const { seedProducts, getProduct, getAllProducts } = require('../src/repository/products');

const productHandler = withParse(handler);

describe('Product Routes', () => {
  let event;
  let context;
  beforeEach(async () => {
    await db.connectToDb();
    await db.dropDb();
    event = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    context = {};
  });

  afterAll(() => {
    db.closeConnection();
  });

  it('fetches products', async () => {
    await seedProducts(5);
    const newEvent = { ...event, path: `api/products`, httpMethod: 'GET' };
    const response = await productHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body.total).toBe(5);
    expect(response.body.selectedProducts.length).toBe(5);
  });

  it('fetches a product', async () => {
    await seedProducts(1);
    const newProduct = await getProduct(1);
    const newEvent = { ...event, path: `api/products/${newProduct._id}`, httpMethod: 'GET' };
    const response = await productHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBe(null);
    expect(response.body.id).toBe(newProduct._id);
  });

  it('throws a 404 on wrong product ID', async () => {
    await seedProducts(1);
    const newProduct = await getProduct(1);
    const newEvent = { ...event, path: `api/products/${newProduct._id + 1}`, httpMethod: 'GET' };
    const response = await productHandler(newEvent, context);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Product not found');
  });

  it('creates a product', async () => {
    const product = {
      sku: '254267942-8',
      title: 'pellentesque',
      desc: 'Donec posuere metus vitae ipsum.',
      stocked: true,
      basePrice: 16.63,
      price: 16.63,
    };

    const newEvent = { ...event, path: `api/products`, httpMethod: 'POST', body: product };
    const response = await productHandler(newEvent, context);

    const products = await getAllProducts();

    expect(products.length).toBe(1);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('image');
    expect(response.body.image).toBe('https://dummyimage.com/300x300.jpg');
    expect(response.body.title).toEqual(product.title);
    expect(response.body.price).toEqual(product.price);
  });

  it('should throw validation errors on post', async () => {
    const product = {
      sku: 254267942,
      title: 111,
      desc: 'Donec posuere metus vitae ipsum.',
      stocked: true,
      price: 16.63,
    };

    const newEvent = { ...event, path: `api/products`, httpMethod: 'POST', body: product };
    const response = await productHandler(newEvent, context);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toEqual('Bad Request');
    expect(response.body.message).toEqual('One or more validations failed');
    expect(response.body.details.length).toBe(3);
  });

  it('saves a product', async () => {
    await seedProducts(1);
    const oldProduct = await getProduct(1);

    // changing title and price
    const newProduct = {
      sku: oldProduct.sku,
      title: 'newtitle',
      desc: oldProduct.desc,
      image: oldProduct.image,
      stocked: oldProduct.stocked,
      basePrice: oldProduct.basePrice,
      price: 15,
    };

    const newEvent = { ...event, path: `api/products/${oldProduct._id}`, httpMethod: 'PUT', body: newProduct };
    const response = await productHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toEqual(oldProduct._id);
    expect(response.body.sku).toEqual(oldProduct.sku);
    expect(response.body.title).toEqual(newProduct.title);
    expect(response.body.price).toEqual(newProduct.price);
  });

  it('should throw validation errors on update', async () => {
    await seedProducts(1);
    const oldProduct = await getProduct(1);

    // changing title and price
    const newProduct = {
      sku: oldProduct.sku,
      title: 111,
      desc: oldProduct.desc,
      image: oldProduct.image,
      stocked: oldProduct.stocked,
      basePrice: oldProduct.basePrice,
      price: 'wow',
    };

    const newEvent = { ...event, path: `api/products/${oldProduct._id}`, httpMethod: 'PUT', body: newProduct };
    const response = await productHandler(newEvent, context);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toEqual('Bad Request');
    expect(response.body.message).toEqual('One or more validations failed');
    expect(response.body.details.length).toBe(2);
  });

  it('deletes a product', async () => {
    await seedProducts(1);
    const oldProduct = await getProduct(1);

    const newEvent = { ...event, path: `api/products/${oldProduct._id}`, httpMethod: 'DELETE' };
    const response = await productHandler(newEvent, context);

    const newProduct = await getProduct(1);

    // we expect back the product we just deleted
    expect(response.body.id).toEqual(oldProduct._id);
    expect(newProduct).toEqual(null);
  });

  it('should return a 404 when the product id on delete is faulty', async () => {
    await seedProducts(1);
    const products = await getAllProducts();

    const newEvent = { ...event, path: `api/products/${products[0]._id + 1}`, httpMethod: 'DELETE' };
    const response = await productHandler(newEvent, context);

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Product not found');
  });
});
