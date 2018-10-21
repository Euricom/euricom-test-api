const {
  gql
} = require('apollo-server');

const Query = `
  type Query {
    product(id: Int): Product
    allProducts(
      orderBy: String
      first: Int
      after: String
      before: String
      last: Int
    ): ProductConnection

    basket(checkoutID: String!): Basket
  }
`;

const Mutation = gql `
  type Mutation {
    addOrUpdateProduct(input: ProductInput!): AddOrUpdateProductPayload
    deleteProduct(id: Int!): DeleteProductPayload

    addItemToBasket(input: AddItemToBasketInput!): AddItemToBasketPayload
    removeItemFromBasket(
      input: RemoveItemFromBasketInput!
    ): RemoveItemFromBasketPayload
    clearBasket(checkoutID: ID): ClearBasketPayload
  }
`;

module.exports = {
  getSchema() {
    const moduleArray = [];
    moduleArray[0] = Query;
    moduleArray[1] = Mutation;
    return moduleArray;
  }
};
