const helpers = require('./helpers/helpers');
const productData = require('../src/data/products');

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
    const data = await helpers.executeQuery(query, {}, 200);

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
    const data = await helpers.executeQuery(query, { id: 1 }, 200);
    // console.log(data);

    // assert
    expect(data.product.id).toBe(1);
    expect(data.product.title).toBe(apple.title);
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

    expect(data.addOrUpdateProduct.product.title).toBe(product.title);
    expect(data.addOrUpdateProduct.product.sku).toBe(product.sku);
    expect(data.addOrUpdateProduct.product.price).toBe(product.price);
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

    const data = await helpers.executeMutation(mutation, { productId: 1 }, 200);

    expect(data.deleteProduct.product.id).toBe(1);
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

    const data = await helpers.executeMutation(mutation, { productId: 3 }, 200);

    expect(data.deleteProduct.product).toBe(null);
  });
});
