const graphqlTools = require('graphql-tools');
const productResolvers = require('./product/product.resolver');
const productType = require('./product/product.type');
const basketResolvers = require('./basket/basket.resolver');
const basketType = require('./basket/basket.type');
const {
  gql
} = require('apollo-server');
const rootSchema = require('./root/root.schema')

const resolvers = [productResolvers, basketResolvers];

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
  ],
  resolvers,
});

module.exports = schema;
