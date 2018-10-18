const { gql } = require('apollo-server');

const Product = gql`
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
`;

const ProductInput = gql`
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
`;

const ProductEdge = gql`
  type ProductEdge {
    node: Product
    cursor: String!
  }
`;

const ProductConnection = gql`
  type ProductConnection {
    pageInfo: PageInfo!
    edges: [ProductEdge]
    totalCount: Int
    product: [Product]
  }
`;

const AddOrUpdateProductPayload = gql`
  type AddOrUpdateProductPayload {
    product: Product
  }
`;

const DeleteProductPayload = gql`
  type DeleteProductPayload {
    product: Product
  }
`;

const pageInfo = gql`
  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }
`;

module.exports = {
  getTypes: function() {
    var moduleArray = [];
    moduleArray[0] = Product;
    moduleArray[1] = ProductEdge;
    moduleArray[2] = ProductConnection;
    moduleArray[3] = AddOrUpdateProductPayload;
    moduleArray[4] = DeleteProductPayload;
    moduleArray[5] = ProductInput;
    moduleArray[6] = pageInfo;
    return moduleArray;
  },
};
