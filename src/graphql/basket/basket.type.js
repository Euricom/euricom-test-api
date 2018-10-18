const { gql } = require('apollo-server');

const BasketItem = gql`
  type BasketItem {
    id: ID
    product: Product
    quantity: Int
  }
`;

const Basket = gql`
  type Basket {
    checkoutID: ID
    items: [BasketItem]
  }
`;

const BasketItemInput = gql`
  input BasketItemInput {
    quantity: Int!
    productId: Int!
  }
`;

const AddItemToBasketInput = gql`
  input AddItemToBasketInput {
    checkoutID: ID!
    item: BasketItemInput!
  }
`;

const RemoveItemFromBasketInput = gql`
  input RemoveItemFromBasketInput {
    checkoutID: ID!
    productId: Int!
  }
`;
const AddItemToBasketPayload = gql`
  type AddItemToBasketPayload {
    basket: Basket
  }
`;

const RemoveItemFromBasketPayload = gql`
  type RemoveItemFromBasketPayload {
    basket: Basket
  }
`;

const ClearBasketPayload = gql`
  type ClearBasketPayload {
    basket: Basket
  }
`;

module.exports = {
  getTypes: function() {
    var moduleArray = [];
    moduleArray[0] = BasketItem;
    moduleArray[1] = Basket;
    moduleArray[2] = BasketItemInput;
    moduleArray[3] = AddItemToBasketInput;
    moduleArray[4] = AddItemToBasketPayload;
    moduleArray[5] = RemoveItemFromBasketInput;
    moduleArray[6] = ClearBasketPayload;
    moduleArray[7] = RemoveItemFromBasketPayload;
    return moduleArray;
  },
};
