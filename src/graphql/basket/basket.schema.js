const { gql } = require('apollo-server');

const typedefs = gql`
  type BasketItem {
    id: ID
    product: Product
    quantity: Int
  }

  type Basket {
    checkoutID: ID
    items: [BasketItem]
  }

  input BasketItemInput {
    quantity: Int!
    productId: Int!
  }

  input AddItemToBasketInput {
    checkoutID: ID!
    item: BasketItemInput!
  }

  input RemoveItemFromBasketInput {
    checkoutID: ID!
    productId: Int!
  }

  type AddItemToBasketPayload {
    basket: Basket
  }

  type RemoveItemFromBasketPayload {
    basket: Basket
  }

  type ClearBasketPayload {
    basket: Basket
  }
`;

module.exports = typedefs;
