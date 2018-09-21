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

  type AddOrUpdateProductPayload {
    product: Product
  }

  type DeleteProductPayload {
    product: Product
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

  type BasketItem {
    product: Product
    quantity: Int
  }

  type Basket {
    items: [BasketItem]
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

  type AddOrUpdateUserPayload {
    user: User
  }

  type DeleteUserPayload {
    user: User
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

  type Mutation {
    addOrUpdateUser(input: UserInput!): AddOrUpdateUserPayload
    deleteUser(id: Int): DeleteUserPayload

    addOrUpdateProduct(input: ProductInput!): AddOrUpdateProductPayload
    deleteProduct(id: Int): DeleteProductPayload

    addTask(desc: String): AddTaskPayload
    completeTask(id: Int): CompleteTaskPayload
    deleteTask(id: Int): DeleteTaskPayload
  }

  type Query {
    product(id: Int): Product
    allProducts(
      orderBy: String
      first: Int
      after: String
      before: String
      last: Int
    ): ProductConnection
    basket: Basket

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