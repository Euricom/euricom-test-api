const { gql } = require('apollo-server');

const typedefs = gql`
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

  type AddOrUpdateUserPayload {
    user: User
  }

  type DeleteUserPayload {
    user: User
  }
`;

module.exports = typedefs;
