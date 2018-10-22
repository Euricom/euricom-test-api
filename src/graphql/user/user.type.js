const { gql } = require('apollo-server');

const Address = gql`
  type Address {
    street: String
    city: String
    zip: String
  }
`;

const User = gql`
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
`;

const UserEdge = gql`
  type UserEdge {
    node: User
    cursor: String!
  }
`;

const UserConnection = gql`
  type UserConnection {
    pageInfo: PageInfo!
    edges: [UserEdge]
    totalCount: Int
    user: [User]
  }
`;

const AddressInput = gql`
  input AddressInput {
    street: String
    city: String
    zip: String
  }
`;

const UserInput = gql`
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
`;

const AddOrUpdateUserPayload = gql`
  type AddOrUpdateUserPayload {
    user: User
  }
`;

const DeleteUserPayload = gql`
  type DeleteUserPayload {
    user: User
  }
`;

module.exports = {
  getTypes() {
    const moduleArray = [];
    moduleArray[0] = User;
    moduleArray[1] = UserEdge;
    moduleArray[2] = UserConnection;
    moduleArray[3] = UserInput;
    moduleArray[4] = AddOrUpdateUserPayload;
    moduleArray[5] = DeleteUserPayload;
    moduleArray[6] = Address;
    moduleArray[7] = AddressInput;
    return moduleArray;
  },
};
