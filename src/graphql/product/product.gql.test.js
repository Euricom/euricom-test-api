const supertest = require('supertest');
const gqltest = require('../../../test/gqltest');
const app = require('../../express');
const productData = require('../../data/products');

const request = gqltest('/graphql', supertest);
const agent = request(app);

describe('GraphQL Products', () => {
  let apple;
  let orange;
  beforeEach(() => {
    productData.clearProducts();
    apple = { id: 1, title: 'apple' };
    orange = { id: 2, title: 'orange' };
  });

  test('query allProducts', async () => {
    // arrange
    productData.addProducts([apple, orange]);
    const query = `
      {
        allProducts {
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
              node {
                  id
                  title
                  price
                  basePrice
                  stocked
              }
          }
        }
      }
    `;

    // act
    const res = await agent.postQuery(query, {});

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.allProducts.totalCount).toBe(2);
    expect(res.body.data.allProducts.pageInfo.hasNextPage).toBe(false);
    expect(res.body.data.allProducts.pageInfo.hasPreviousPage).toBe(false);
    expect(res.body.data).toMatchSnapshot();
  });

  test('query product', async () => {
    // arrange
    productData.addProducts([apple, orange]);
    const query = `
      query getProduct($id: Int!) {
        product(id: $id) {
          id
          title
          price
          basePrice
          stocked
        }
      }
    `;

    // act
    const res = await agent.postQuery(query, { id: 1 }, 200);

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.product.id).toBe(1);
    expect(res.body.data.product.title).toBe(apple.title);
  });

  test('mutate addOrUpdateProduct', async () => {
    const product = {
      title: 'new product',
      price: 12,
      sku: '111',
    };

    const mutation = `mutation addOrUpdateProduct($product: ProductInput!) {
      addOrUpdateProduct(input: $product) {
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
      }
    }`;

    const res = await agent.postMutation(mutation, { product });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.addOrUpdateProduct.product.title).toBe(product.title);
    expect(res.body.data.addOrUpdateProduct.product.sku).toBe(product.sku);
    expect(res.body.data.addOrUpdateProduct.product.price).toBe(product.price);
  });

  test('mutate deleteProduct', async () => {
    productData.addProducts([apple, orange]);

    const mutation = `mutation deleteProduct($productId: Int!) {
      deleteProduct(id: $productId) {
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
    }}`;

    const res = await agent.postMutation(mutation, { productId: 1 });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.deleteProduct.product.id).toBe(1);
  });

  test('return 200 when product was not found on deleteProduct', async () => {
    productData.addProducts([apple, orange]);

    const mutation = `mutation deleteProduct($productId: Int!) {
      deleteProduct(id: $productId) {
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
    }}`;

    const res = await agent.postMutation(mutation, { productId: 3 });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.deleteProduct.product).toBe(null);
  });
});
