const { gql } = require('apollo-server');

//
// GraphQL scheme
//
const typeDefs = gql`
  type Task {
    id: Int
    desc: String
    completed: Boolean
  }

  type Address {
    street: String
    city: String
    zip: String
  }

  type User {
    id: Int
    firstName: String
    lastName: String
    age: Int
    email: String
    image: String
    phone: String
    company: String
    address: Address
  }

  type UserEdge {
    node: User
    cursor: String!
  }

  type UserConnection {
    pageInfo: PageInfo!
    edges: [UserEdge]
    totalCount: Int
    user: [User]
  }

  input AddressInput {
    street: String
    city: String
    zip: String
  }

  input UserInput {
    id: Int
    firstName: String!
    lastName: String!
    age: Int
    email: String!
    image: String
    phone: String
    company: String
    address: AddressInput
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

  type AddOrUpdateUserPayload {
    user: User
  }

  type DeleteUserPayload {
    user: User
  }

  type AddTaskPayload {
    task: Task
  }

  type CompleteTaskPayload {
    task: Task
  }

  type DeleteTaskPayload {
    task: Task
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

  type Mutation {
    addOrUpdateUser(input: UserInput!): AddOrUpdateUserPayload
    deleteUser(id: Int!): DeleteUserPayload

    addItemToBasket(input: AddItemToBasketInput!): AddItemToBasketPayload

    removeItemFromBasket(
      input: RemoveItemFromBasketInput!
    ): RemoveItemFromBasketPayload

    clearBasket(checkoutID: ID): ClearBasketPayload

    addTask(desc: String!): AddTaskPayload
    completeTask(id: Int!): CompleteTaskPayload
    deleteTask(id: Int!): DeleteTaskPayload
  }

  type Query {
    basket(checkoutID: String!): Basket

    user(id: Int): User
    allUsers(
      orderBy: String
      first: Int
      after: String
      before: String
      last: Int
    ): UserConnection

    task(id: Int): Task
    tasks: [Task]
  }
`;

module.exports = typeDefs;
