const helpers = require('./helpers/helpers');

const basketData = require('../src/data/basket');
const productData = require('../src/data/products');

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

    const data = await helpers.executeQuery(
      query,
      { checkoutID: basketKey },
      200,
    );

    expect(data.data.basket.items.length).toBe(2);
    expect(data.data.basket.checkoutID).toBe(basketKey);
    expect(data.data).toMatchSnapshot();
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

    const data = await helpers.executeMutation(
      mutation,
      { key: basketKey, item: { quantity: 2, productId: 3 } },
      200,
    );

    const product = data.data.addItemToBasket.basket.items.find(
      (item) => item.product.id === 3,
    );

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

    const data = await helpers.executeMutation(
      mutation,
      { key: basketKey, item: { quantity: 2, productId: 4 } },
      200,
    );

    expect(data.data.addItemToBasket).toBe(null);
    expect(data.errors[0].extensions.exception.errors[0].message).toBe(
      'Product not found',
    );
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

    const data = await helpers.executeMutation(
      mutation,
      { key: basketKey, item: { quantity: 2, productId: 5 } },
      200,
    );

    expect(data.data.addItemToBasket).toBe(null);
    expect(data.errors[0].extensions.exception.errors[0].message).toBe(
      'Product not in stock',
    );
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

    const data = await helpers.executeMutation(
      mutation,
      { key: basketKey, productId: 2 },
      200,
    );
    console.log(data.data);
    const product = data.data.removeItemFromBasket.basket.items.find(
      (item) => item.product.id === 2,
    );
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

    const data = await helpers.executeMutation(
      mutation,
      { key: basketKey, productId: 10 },
      200,
    );
    console.log(data.data);
    expect(data.data.removeItemFromBasket).toBe(null);
    expect(data.errors[0].message).toBe('Product not found');
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

    const data = await helpers.executeMutation(
      mutation,
      { checkoutID: basketKey },
      200,
    );

    expect(data.data.clearBasket).toHaveProperty('basket');
  });
});
