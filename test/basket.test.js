const request = require('supertest');
const app = require('../src/express');
const db = require('../src/dbConnection');

const { clearBasket } = require('../src/repository/basket');

const { addProducts } = require('../src/repository/products');

const basketKey = '123';

describe('Basket Routes', () => {
  let apple;
  let orange;
  let pear;
  let lemon;
  beforeEach(async () => {
    // standard basket:
    // [ { id: 1, productId: 1, quantity: 1 },
    // { id: 2, productId: 2, quantity: 4 } ]
    await db.connectToDb();
    await db.dropDb();
    apple = { _id: 1, title: 'apple', stocked: false };
    orange = { _id: 2, title: 'orange', stocked: true };
    pear = { _id: 3, title: 'pear', stocked: true };
    lemon = { _id: 4, title: 'lemon', stocked: false };
    await addProducts([apple, orange, pear, lemon]);
    await clearBasket(basketKey, true);
  });

  it('fetches the basket', async () => {
    const response = await request(app.app)
      .get(`/api/basket/${basketKey}`)
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('quantity');
    expect(response.body[0]).toHaveProperty('productId');
  });

  it('adds a product to the basket', async () => {
    const response = await request(app.app)
      .post(`/api/basket/${basketKey}/product/3`)
      .expect(201);

    expect(response.body[response.body.length - 1]).toHaveProperty('id');
    expect(response.body[response.body.length - 1]).toHaveProperty('quantity');
    expect(response.body[response.body.length - 1].productId).toEqual(3);
    expect(response.body[response.body.length - 1].quantity).toEqual(1);
  });

  it('should throw an error on faulty product id on add product', async () => {
    const response = await request(app.app)
      .post(`/api/basket/${basketKey}/product/11`)
      .expect(404);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Product not found');
  });

  it('should throw an error when trying to add an out of stock product', async () => {
    const response = await request(app.app)
      .post(`/api/basket/${basketKey}/product/4`)
      .expect(409);

    expect(response.body.code).toEqual('Conflict');
    expect(response.body.message).toEqual('Product not in stock');
  });

  it('removes a product from the basket', async () => {
    const response = await request(app.app)
      .delete(`/api/basket/${basketKey}/product/1`)
      .expect(200);

    expect(response.body.find((item) => item.id === 1)).toEqual(undefined);
  });

  it('should throw an error on faulty product id on delete product', async () => {
    const response = await request(app.app)
      .delete(`/api/basket/${basketKey}/product/11`)
      .expect(404);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Product not found');
  });

  it('updates a product from the basket', async () => {
    const response = await request(app.app)
      .patch(`/api/basket/${basketKey}/product/2`)
      .send({
        quantity: 10,
      })
      .expect(200);

    const basketItem = response.body.find((item) => item.id === 2);

    expect(basketItem.quantity).toEqual(10);
  });

  it('should throw an error on faulty product id on update product', async () => {
    const response = await request(app.app)
      .patch(`/api/basket/${basketKey}/product/11`)
      .send({
        quantity: 10,
      })
      .expect(404);

    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Product not found');
  });

  it('should throw an error when trying to add an out of stock product', async () => {
    const response = await request(app.app)
      .patch(`/api/basket/${basketKey}/product/1`)
      .send({
        quantity: 10,
      })
      .expect(409);

    expect(response.body.code).toEqual('Conflict');
    expect(response.body.message).toEqual('Product not in stock');
  });

  it('should delete the basket', async () => {
    const response = await request(app.app)
      .delete(`/api/basket/${basketKey}`)
      .expect(200);

    // default is 2 so it returns the previous basket
    expect(response.body.length).toEqual(2);
  });

  it('should reset the basket', async () => {
    const response = await request(app.app)
      .delete(`/api/basket/${basketKey}/reset`)
      .expect(200);

    // default is 2
    expect(response.body.length).toEqual(2);
  });
});
