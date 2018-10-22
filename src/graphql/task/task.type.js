const {
    gql
} = require('apollo-server');

const Task = gql `
  type Task {
    id: Int
    desc: String
    completed: Boolean
  }
`;

const AddTaskPayload = gql `
  type AddTaskPayload {
    task: Task
  }
  `;

const CompleteTaskPayload = gql `
  type CompleteTaskPayload {
    task: Task
  }`;

const DeleteTaskPayload = gql `
  type DeleteTaskPayload {
    task: Task
  }`;

module.exports = {
    getTypes() {
        const moduleArray = [];
        moduleArray[0] = Task;
        moduleArray[1] = AddTaskPayload;
        moduleArray[2] = CompleteTaskPayload;
        moduleArray[3] = DeleteTaskPayload;

        return moduleArray;
    }
}
