const graphqlTools = require('graphql-tools');
const productResolvers = require('./product/product.resolver');
const productType = require('./product/product.type');
const basketResolvers = require('./basket/basket.resolver');
const taskResolvers = require('./task/task.resolver');
const userResolvers = require('./user/user.resolver');
const basketType = require('./basket/basket.type');
const taskType = require('./task/task.type');
const userType = require('./user/user.type');
const {
    gql
} = require('apollo-server');
const rootSchema = require('./root/root.schema')

const resolvers = [productResolvers, basketResolvers, taskResolvers, userResolvers];

const SchemaDefinition = gql `
  schema {
    query: Query
    mutation: Mutation
  }
`;

const schema = graphqlTools.makeExecutableSchema({
    typeDefs: [
        ...rootSchema.getSchema(),
        ...productType.getTypes(),
        ...basketType.getTypes(),
        ...taskType.getTypes(),
        ...userType.getTypes()
    ],
    resolvers,
});

module.exports = schema;
