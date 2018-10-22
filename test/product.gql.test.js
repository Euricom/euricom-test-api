const request = require('supertest');
const app = require('../src/express');

const productData = require('../src/data/products');

const executeQuery = (query, variables, expectedStatus) => {
  return request(app.app)
    .post('/graphql')
    .send({ query, variables })
    .then((res) => {
      if (res.status != expectedStatus) {
        console.error('Response:', res.body);
      }
      expect(res.status).toBe(expectedStatus);
      return res.body.data;
    });
};

const executeMutation = (mutation, variables, expectedStatus) => {
  return request(app.app)
    .post('/graphql')
    .send({ query: mutation, variables })
    .then((res) => {
      if (res.status != expectedStatus) {
        console.error('Response:', res.body);
      }
      expect(res.status).toBe(expectedStatus);
      return res.body.data;
    });
};

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
    const data = await executeQuery(query, {}, 200);

    // assert
    expect(data.allProducts.totalCount).toBe(2);
    expect(data.allProducts.pageInfo.hasNextPage).toBe(false);
    expect(data.allProducts.pageInfo.hasPreviousPage).toBe(false);
    expect(data).toMatchSnapshot();
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
    const data = await executeQuery(query, { id: 1 }, 200);
    // console.log(data);

    // assert
    expect(data.product.id).toBe(1);
    expect(data.product.title).toBe(apple.title);
  });

  test('mutate addOrUpdateProduct', async () => {});
});
