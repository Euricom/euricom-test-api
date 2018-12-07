const { gql } = require('apollo-server');

const typedefs = gql`
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

  type AddOrUpdateProductPayload {
    product: Product
  }

  type DeleteProductPayload {
    product: Product
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`;

module.exports = typedefs;
