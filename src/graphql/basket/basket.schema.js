const { gql } = require('apollo-server');

const BasketQuery = gql`
  extend type Query {
    basket(checkoutID: String!): Basket
  }
`;

const BasketMutation = gql`
  extend type Mutation {
    addItemToBasket(input: AddItemToBasketInput!): AddItemToBasketPayload
    removeItemFromBasket(
      input: RemoveItemFromBasketInput!
    ): RemoveItemFromBasketPayload
    clearBasket(checkoutID: ID): ClearBasketPayload
  }
`;

module.exports = {
  getSchema: function() {
    var moduleArray = [];
    moduleArray[0] = BasketQuery;
    moduleArray[1] = BasketMutation;
    return moduleArray;
  },
};
