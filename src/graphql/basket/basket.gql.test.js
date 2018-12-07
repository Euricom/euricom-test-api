const supertest = require('supertest');
const gqltest = require('../../../test/gqltest');
const app = require('../../express');
const basketData = require('../../data/basket');
const productData = require('../../data/products');

const request = gqltest('/graphql', supertest);
const agent = request(app);

describe('GraphQL Basket', () => {
  const basketKey = 'basketKey';
  let basket;
  let apple;
  let orange;
  let pear;
  let melon;
  beforeEach(() => {
    apple = { id: 1, title: 'apple', productId: 1 };
    orange = { id: 2, title: 'orange', productId: 2 };
    pear = { id: 3, title: 'pear', productId: 3, stocked: true };
    melon = { id: 5, title: 'pear', productId: 5, stocked: false };
    productData.clearProducts();
    productData.addProducts([apple, orange, pear, melon]);
    basketData.clearBasket(basketKey, true);
    basketData.getOrCreateBasket(basketKey);
  });

  test('query basket', async () => {
    const query = `
      query basket($checkoutID: String!) {
        basket(checkoutID: $checkoutID) {
          checkoutID
          items {
            product {
              id
              sku
              image
              title
              price
              basePrice
              stocked
              desc
            }
            quantity
          }
        }
      }
    `;

    const res = await agent.postQuery(query, { checkoutID: basketKey });

    // assert
    expect(res).toHaveStatus(200);

    expect(res.body.data.basket.items.length).toBe(2);
    expect(res.body.data.basket.checkoutID).toBe(basketKey);
    expect(res.body.data).toMatchSnapshot();
  });

  test('mutation addItemToBasket', async () => {
    const mutation = `
      mutation addItemToBasket($key: ID!, $item: BasketItemInput!) {
        addItemToBasket(input: { checkoutID: $key, item: $item }) {
          basket {
            checkoutID
            items {
              product {
                id
                sku
                image
                title
                price
                basePrice
                stocked
                desc
              }
              quantity
            }
          }
        }
      }
    `;

    const res = await agent.postMutation(mutation, { key: basketKey, item: { quantity: 2, productId: 3 } });
    expect(res).toHaveStatus(200);

    const product = res.body.data.addItemToBasket.basket.items.find((item) => item.product.id === 3);
    expect(product.quantity).toBe(2);
  });

  test('throw error on faulty product id on addItemToBasket', async () => {
    const mutation = `
      mutation addItemToBasket($key: ID!, $item: BasketItemInput!) {
        addItemToBasket(input: { checkoutID: $key, item: $item }) {
          basket {
            checkoutID
            items {
              product {
                id
                sku
                image
                title
                price
                basePrice
                stocked
                desc
              }
              quantity
            }
          }
        }
      }
    `;

    const res = await agent.postMutation(mutation, { key: basketKey, item: { quantity: 2, productId: 4 } });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.addItemToBasket).toBe(null);
    expect(res.body.errors[0].message).toBe('Product not found');
    expect(res.body.errors[0].path[0]).toBe('addItemToBasket');
    expect(res.body.errors[0].extensions.code).toBe('PRODUCT_NOT_FOUND');
    expect(res.body.errors[0]).toMatchSnapshot();
  });

  test('throw error on product out of stock on addItemToBasket', async () => {
    const mutation = `
      mutation addItemToBasket($key: ID!, $item: BasketItemInput!) {
        addItemToBasket(input: { checkoutID: $key, item: $item }) {
          basket {
            checkoutID
            items {
              product {
                id
                sku
                image
                title
                price
                basePrice
                stocked
                desc
              }
              quantity
            }
          }
        }
      }
    `;

    const res = await agent.postMutation(mutation, { key: basketKey, item: { quantity: 2, productId: 5 } });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.addItemToBasket).toBe(null);

    expect(res.body.errors[0].message).toBe('Product not in stock');
    expect(res.body.errors[0].path[0]).toBe('addItemToBasket');
    expect(res.body.errors[0].extensions.code).toBe('NO_STOCK');
  });

  test('mutation removeItemFromBasket', async () => {
    const mutation = `
      mutation removeItemFromBasket($key: ID!, $productId: Int!) {
        removeItemFromBasket(input: { checkoutID: $key, productId: $productId }) {
          basket {
            checkoutID
            items {
              product {
                id
                sku
                image
                title
                price
                basePrice
                stocked
                desc
              }
              quantity
            }
          }
        }
      }
    `;

    const res = await agent.postMutation(mutation, { key: basketKey, productId: 2 });
    expect(res).toHaveStatus(200);

    const product = res.body.data.removeItemFromBasket.basket.items.find((item) => item.product.id === 2);
    expect(product).toBe(undefined);
  });

  test('throw product not found on mutation removeItemFromBasket', async () => {
    const mutation = `
      mutation removeItemFromBasket($key: ID!, $productId: Int!) {
        removeItemFromBasket(input: { checkoutID: $key, productId: $productId }) {
          basket {
            checkoutID
            items {
              product {
                id
                sku
                image
                title
                price
                basePrice
                stocked
                desc
              }
              quantity
            }
          }
        }
      }
    `;

    const res = await agent.postMutation(mutation, { key: basketKey, productId: 10 });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.removeItemFromBasket).toBe(null);
    expect(res.body.errors[0].message).toBe('Product not found');
  });

  test('mutation clearBasket', async () => {
    const mutation = `
      mutation clearBasket($checkoutID: ID!) {
        clearBasket(checkoutID: $checkoutID) {
          basket {
            checkoutID
            items {
              product {
                id
                sku
                image
                title
                price
                basePrice
                stocked
                desc
              }
              quantity
            }
          }
        }
      }
    `;

    const res = await agent.postMutation(mutation, { checkoutID: basketKey });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.clearBasket).toHaveProperty('basket');
  });
});
