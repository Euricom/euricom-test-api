const {
  gql
} = require('apollo-server');

const ProductQuery = gql`
  extend type Query {
    product(id: Int): Product
    allProducts(orderBy: String, first: Int, after: String, before: String, last: Int): ProductConnection
  }
`;

const ProductMutation = gql`
  extend type Mutation {
    addOrUpdateProduct(input: ProductInput!): AddOrUpdateProductPayload
    deleteProduct(id: Int!): DeleteProductPayload
  }
`;

module.exports = {
  getSchema: function () {
    var moduleArray = [];
    moduleArray[0] = ProductMutation;
    moduleArray[1] = ProductQuery;
    return moduleArray;
  }
};
