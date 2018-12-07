const { gql } = require('apollo-server');

const typedefs = gql`
  type Task {
    id: Int
    desc: String
    completed: Boolean
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
`;

module.exports = typedefs;
