const { handler } = require('../src/api/serverless/handlers/basketHandler');
const { withParse } = require('../src/api/serverless/helper');
const db = require('../src/dbConnection');

const { clearBasket } = require('../src/repository/basket');

const { addProducts } = require('../src/repository/products');

const basketKey = '123';
const basketHandler = withParse(handler);

describe('Basket Routes', () => {
  let event;
  let context;
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
  it('fetches the basket', async () => {
    const newEvent = { ...event, path: `api/basket/${basketKey}`, httpMethod: 'GET' };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('quantity');
    expect(response.body[0]).toHaveProperty('productId');
  });

  it('adds a product to the basket', async () => {
    const newEvent = { ...event, path: `api/basket/${basketKey}/product/3`, httpMethod: 'POST' };
    const response = await basketHandler(newEvent, context);
    console.log('response', response);

    expect(response.statusCode).toBe(201);
    expect(response.body[response.body.length - 1]).toHaveProperty('id');
    expect(response.body[response.body.length - 1]).toHaveProperty('quantity');
    expect(response.body[response.body.length - 1].productId).toEqual(3);
    expect(response.body[response.body.length - 1].quantity).toEqual(1);
  });

  it('should throw an error on faulty product id on add product', async () => {
    const newEvent = { ...event, path: `api/basket/${basketKey}/product/11`, httpMethod: 'POST' };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Product not found');
  });

  it('should throw an error when trying to add an out of stock product', async () => {
    const newEvent = { ...event, path: `api/basket/${basketKey}/product/4`, httpMethod: 'POST' };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(409);
    expect(response.body.code).toEqual('Conflict');
    expect(response.body.message).toEqual('Product not in stock');
  });

  it('removes a product from the basket', async () => {
    const newEvent = { ...event, path: `api/basket/${basketKey}/product/1`, httpMethod: 'DELETE' };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    expect(response.body.find((item) => item.id === 1)).toEqual(undefined);
  });

  it('should throw an error on faulty product id on delete product', async () => {
    const newEvent = { ...event, path: `api/basket/${basketKey}/product/11`, httpMethod: 'DELETE' };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Product not found');
  });

  it('updates a product from the basket', async () => {
    const newEvent = {
      ...event,
      path: `api/basket/${basketKey}/product/2`,
      httpMethod: 'PATCH',
      body: { quantity: 10 },
    };
    const response = await basketHandler(newEvent, context);

    const basketItem = response.body.find((item) => item.id === 2);

    expect(response.statusCode).toBe(200);
    expect(basketItem.quantity).toEqual(10);
  });

  it('should throw an error on faulty product id on update product', async () => {
    const newEvent = {
      ...event,
      path: `api/basket/${basketKey}/product/11`,
      httpMethod: 'PATCH',
      body: { quantity: 10 },
    };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(404);
    expect(response.body.code).toEqual('Not Found');
    expect(response.body.message).toEqual('Product not found');
  });

  it('should throw an error when trying to add an out of stock product', async () => {
    const newEvent = {
      ...event,
      path: `api/basket/${basketKey}/product/1`,
      httpMethod: 'POST',
      body: { quantity: 10 },
    };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(409);
    expect(response.body.code).toEqual('Conflict');
    expect(response.body.message).toEqual('Product not in stock');
  });

  it('should delete the basket', async () => {
    const newEvent = { ...event, path: `api/basket/${basketKey}`, httpMethod: 'DELETE' };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    // default is 2 so it returns the previous basket
    expect(response.body.length).toEqual(2);
  });

  it('should reset the basket', async () => {
    const newEvent = { ...event, path: `api/basket/${basketKey}/reset`, httpMethod: 'DELETE' };
    const response = await basketHandler(newEvent, context);

    expect(response.statusCode).toBe(200);
    // default is 2
    expect(response.body.length).toEqual(2);
  });
});
