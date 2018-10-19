const fs = require('fs');
const path = require('path');

const request = require('supertest');
const app = require('../src/express');

const {
  seedProducts,
  clearProducts,
  getProduct,
} = require('../src/data/products');

describe('Product Routes', () => {
  beforeEach(() => {
    clearProducts();
    seedProducts();
  });

  it('fetches products', async () => {
    const response = await request(app.app)
      .get('/api/products')
      .expect(200);
    expect(typeof response.body.selectedProducts).toBe('object');
    expect(response.body.selectedProducts).not.toBe(null);
    expect(response.body.selectedProducts.length).toBeGreaterThan(0);
  });

  it('fetches a product', async () => {
    const response = await request(app.app)
      .get('/api/products/1')
      .expect(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).not.toBe(null);
    expect(response.body.id).toBe(1);
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
      .expect(200);
    expect(typeof response.body).toBe('object');
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toEqual(product.title);
    expect(response.body.price).toEqual(product.price);
  });

  // check bad request with validation

  it('saves a product', async () => {
    const oldProduct = getProduct(1);

    //changing title and price
    const newProduct = {
      sku: '254267942-8',
      title: 'newtitle',
      desc: 'Donec posuere metus vitae ipsum.',
      image: 'https://dummyimage.com/300x300.jpg/ff4444/ffffff',
      stocked: true,
      basePrice: 16.63,
      price: 15,
    };

    const response = await request(app.app)
      .put('/api/products/1')
      .send(newProduct)
      .expect(200);

    //check product in db
    expect(typeof response.body).toBe('object');
    expect(response.body.sku).toEqual(oldProduct.sku);
    expect(response.body.title).toEqual(newProduct.title);
    expect(response.body.price).toEqual(newProduct.price);
  });

  it('deletes a product', async () => {
    const product = getProduct(1);

    const response = await request(app.app)
      .delete('/api/products/1')
      .send(product)
      .expect(200);
    expect(typeof response.body).toBe('object');
    expect(response.body.sku).toEqual(product.sku);
    expect(response.body.title).toEqual(product.title);
    expect(response.body.price).toEqual(product.price);
  });
});
