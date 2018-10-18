const graphqlTools = require("graphql-tools");
const productResolvers = require("./product/product.resolver");
const productType = require('./product/product.type');
const productSchema = require('./product/product.schema');
const basketResolvers = require("./basket/basket.resolver");
const basketType = require("./basket/basket.type");
const basketSchema = require("./basket/basket.schema");

const resolvers = [productResolvers, basketResolvers];

const Query = `
  type Query {
    _empty: String
  }
`;

const Mutation = `
  type Mutation {
    _empty: String
  }
`;

const SchemaDefinition = `
schema {
  query: Query
  mutation: Mutation
}
`;

const schema = graphqlTools.makeExecutableSchema({
  typeDefs: [
    Query,
    Mutation,
    ...productSchema.getSchema(),
    ...productType.getTypes(),
    ...basketSchema.getSchema(),
    ...basketType.getTypes()
  ],
  resolvers
});

module.exports = schema;
