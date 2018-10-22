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

    task(id: Int): Task
    tasks: [Task]

    user(id: Int): User
    allUsers(
      orderBy: String
      first: Int
      after: String
      before: String
      last: Int
    ): UserConnection
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

    addTask(desc: String!): AddTaskPayload
    completeTask(id: Int!): CompleteTaskPayload
    deleteTask(id: Int!): DeleteTaskPayload

    addOrUpdateUser(input: UserInput!): AddOrUpdateUserPayload
    deleteUser(id: Int!): DeleteUserPayload
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
