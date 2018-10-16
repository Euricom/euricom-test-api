const { gql } = require('apollo-server');

//
// GraphQL scheme
//
const typeDefs = gql`
  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  type ProductEdge {
    node: Product
    cursor: String!
  }

  type ProductConnection {
    pageInfo: PageInfo!
    edges: [ProductEdge]
    totalCount: Int
    product: [Product]
  }

  type Product {
    id: Int
    sku: String
    title: String
    desc: String
    image: String
    stocked: Boolean
    basePrice: Float
    price: Float
  }

  type BasketItem {
    id: ID
    product: Product
    quantity: Int
  }

  type Basket {
    checkoutID: ID
    items: [BasketItem]
  }

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

  input ProductInput {
    id: Int
    sku: String!
    title: String!
    desc: String
    image: String
    stocked: Boolean
    basePrice: Float
    price: Float!
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

  type AddOrUpdateProductPayload {
    product: Product
  }

  type DeleteProductPayload {
    product: Product
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

    addOrUpdateProduct(input: ProductInput!): AddOrUpdateProductPayload
    deleteProduct(id: Int!): DeleteProductPayload

    addItemToBasket(input: AddItemToBasketInput!): AddItemToBasketPayload

    removeItemFromBasket(input: RemoveItemFromBasketInput!): RemoveItemFromBasketPayload

    clearBasket(checkoutID: ID): ClearBasketPayload

    addTask(desc: String!): AddTaskPayload
    completeTask(id: Int!): CompleteTaskPayload
    deleteTask(id: Int!): DeleteTaskPayload
  }

  type Query {
    product(id: Int): Product
    allProducts(orderBy: String, first: Int, after: String, before: String, last: Int): ProductConnection
    basket(checkoutID: String!): Basket

    user(id: Int): User
    allUsers(orderBy: String, first: Int, after: String, before: String, last: Int): UserConnection

    task(id: Int): Task
    tasks: [Task]
  }
`;

module.exports = typeDefs;
