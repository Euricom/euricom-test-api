require('dotenv').config();
const fs = require('fs');
const path = require('path');

const request = require('supertest');
const app = require('../src/express');
const db = require('../src/dbConnection');

const { seedProducts, clearProducts, getProduct, getAllProducts } = require('../src/repository/products');

describe('Product Routes', () => {
  beforeEach(async () => {
    await db.connectToDb();
    // await clearProducts();
    await db.dropDb();
  });

  it('fetches products', async () => {
    await seedProducts(3);

    const response = await request(app.app)
      .get('/api/products')
      .expect(200);

    expect(response.body.total).toBe(3);
    expect(response.body.selectedProducts.length).toBe(3);
  });

  it('fetches a product', async () => {
    await seedProducts(1);
    const newProduct = await getProduct(1);

    const response = await request(app.app)
      .get(`/api/products/${newProduct._id}`)
      .expect(200);

    expect(response.body).not.toBe(null);
    expect(response.body.id).toBe(newProduct._id);
  });

  it('throws a 404 on wrong product ID', async () => {
    await seedProducts(1);

    const response = await request(app.app)
      .get('/api/products/2')
      .expect(404);

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

    const response = await request(app.app)
      .post('/api/products')
      .send(product)
      .expect(201);

    const products = await getAllProducts();

    expect(products.length).toBe(1);
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

    const response = await request(app.app)
      .post('/api/products')
      .send(product)
      .expect(400);

    expect(response.body.code).toEqual('Bad Request');
    expect(response.body.message).toEqual('One or more validations failed');
    expect(response.body.details.length).toBe(3);
  });

  it('saves a product', async () => {
    await seedProducts(1);
    const oldProduct = await getProduct(1);

    //changing title and price
    const newProduct = {
      sku: oldProduct.sku,
      title: 'newtitle',
      desc: oldProduct.desc,
      image: oldProduct.image,
      stocked: oldProduct.stocked,
      basePrice: oldProduct.basePrice,
      price: 15,
    };

    const response = await request(app.app)
      .put(`/api/products/${oldProduct._id}`)
      .send(newProduct)
      .expect(200);

    expect(response.body.id).toEqual(oldProduct._id);
    expect(response.body.sku).toEqual(oldProduct.sku);
    expect(response.body.title).toEqual(newProduct.title);
    expect(response.body.price).toEqual(newProduct.price);
  });

  it('should throw validation errors on update', async () => {
    await seedProducts(1);
    const oldProduct = await getProduct(1);

    //changing title and price
    const newProduct = {
      sku: oldProduct.sku,
      title: 111,
      desc: oldProduct.desc,
      image: oldProduct.image,
      stocked: oldProduct.stocked,
      basePrice: oldProduct.basePrice,
      price: 'wow',
    };

    const response = await request(app.app)
      .put(`/api/products/${oldProduct._id}`)
      .send(newProduct)
      .expect(400);

    expect(response.body.code).toEqual('Bad Request');
    expect(response.body.message).toEqual('One or more validations failed');
    expect(response.body.details.length).toBe(2);
  });

  it('deletes a product', async () => {
    await seedProducts(1);
    const oldProduct = await getProduct(1);

    const response = await request(app.app)
      .delete(`/api/products/${oldProduct._id}`)
      .expect(200);

    const newProduct = await getProduct(1);

    // we expect back the product we just deleted
    expect(response.body.id).toEqual(oldProduct._id);
    expect(newProduct).toEqual(null);
  });

  it('should return a 404 when the product id on delete is faulty', async () => {
    await seedProducts(1);
    const products = await getAllProducts();

    const response = await request(app.app)
      .delete(`/api/products/${products.length + 1}`)
      .expect(404);
  });
});
