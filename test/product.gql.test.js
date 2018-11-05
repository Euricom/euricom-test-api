const helpers = require('./helpers/helpers');
const productData = require('../src/repository/products');
const db = require('../src/dbConnection');

describe('GraphQL Products', () => {
  let apple;
  let orange;
  beforeEach(async () => {
    await db.connectToDb();
    await db.dropDb();
    apple = { _id: 1, title: 'apple', stocked: false };
    orange = { _id: 2, title: 'orange', stocked: true };
  });

  test('query allProducts', async () => {
    // arrange
    await productData.addProducts([apple, orange]);
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
    const data = await helpers.executeQuery(query, {}, 200);

    // assert
    expect(data.data.allProducts.totalCount).toBe(2);
    expect(data.data.allProducts.pageInfo.hasNextPage).toBe(false);
    expect(data.data.allProducts.pageInfo.hasPreviousPage).toBe(false);
    expect(data.data).toMatchSnapshot();
  });

  test('query product', async () => {
    // arrange
    await productData.addProducts([apple, orange]);
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
    const data = await helpers.executeQuery(query, { id: 1 }, 200);
    // assert
    expect(data.data.product.id).toBe(1);
    expect(data.data.product.title).toBe(apple.title);
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

    const data = await helpers.executeMutation(mutation, { product }, 200);

    expect(data.data.addOrUpdateProduct.product.title).toBe(product.title);
    expect(data.data.addOrUpdateProduct.product.sku).toBe(product.sku);
    expect(data.data.addOrUpdateProduct.product.price).toBe(product.price);
  });

  test('mutate deleteProduct', async () => {
    await productData.addProducts([apple, orange]);

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

    const data = await helpers.executeMutation(mutation, { productId: 1 }, 200);

    expect(data.data.deleteProduct.product.id).toBe(1);
  });

  test('return 200 when product was not found on deleteProduct', async () => {
    await productData.addProducts([apple, orange]);

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

    const data = await helpers.executeMutation(mutation, { productId: 3 }, 200);

    expect(data.data.deleteProduct.product).toBe(null);
  });
});
