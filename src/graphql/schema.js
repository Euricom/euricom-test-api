const graphqlTools = require('graphql-tools');
const { gql } = require('apollo-server');

const { typedefs: Product, resolvers: productResolvers } = require('./product');
const { typedefs: Basket, resolvers: basketResolvers } = require('./basket');
const { typedefs: User, resolvers: userResolvers } = require('./user');
const { typedefs: Task, resolvers: taskResolvers } = require('./task');
const { DateTime } = require('./scalar');

const Query = gql`
  scalar DateTime

  type Query {
    product(id: Int): Product
    allProducts(orderBy: String, first: Int, after: String, before: String, last: Int): ProductConnection

    basket(checkoutID: String!): Basket

    task(id: Int): Task
    tasks: [Task]

    user(id: Int): User
    allUsers(orderBy: String, first: Int, after: String, before: String, last: Int): UserConnection
  }
`;

const Mutation = gql`
  type Mutation {
    """
    Create or save a product
    """
    addOrUpdateProduct(input: ProductInput!): AddOrUpdateProductPayload

    """
    Remove a product
    """
    deleteProduct(id: Int!): DeleteProductPayload

    """
    Add product to basket
    1. If the product already exist in the basket the quantity is added
    2. Product not found: ERROR
    3. Product not in stock: ERROR
    """
    addItemToBasket(input: AddItemToBasketInput!): AddItemToBasketPayload

    """
    Remove the product from the basket
    """
    removeItemFromBasket(input: RemoveItemFromBasketInput!): RemoveItemFromBasketPayload

    """
    Empty the basket
    """
    clearBasket(checkoutID: ID): ClearBasketPayload

    addTask(desc: String!): AddTaskPayload
    completeTask(id: Int!): CompleteTaskPayload
    deleteTask(id: Int!): DeleteTaskPayload

    addOrUpdateUser(input: UserInput!): AddOrUpdateUserPayload
    deleteUser(id: Int!): DeleteUserPayload
  }
`;

const rootResolvers = {
  DateTime,
};

const schema = graphqlTools.makeExecutableSchema({
  typeDefs: [Query, Mutation, Product, Basket, Task, User],
  resolvers: [rootResolvers, productResolvers, basketResolvers, taskResolvers, userResolvers],
});

module.exports = schema;
