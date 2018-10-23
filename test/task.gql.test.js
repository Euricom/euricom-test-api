const helpers = require('./helpers/helpers');

const tasksData = require('../src/data/tasks');

describe('GraphQL Tasks', () => {
  beforeEach(() => {
    tasksData.clearTasks();
    tasksData.seedTasks();
  });
  test('query tasks', async () => {
    const query = `
      {
        tasks {
          id
          desc
          completed
        }
      }
    `;

    const data = await helpers.executeQuery(query, {}, 200);

    expect(data.data.tasks.length).toBeGreaterThan(0);
    expect(data.data).toMatchSnapshot();
  });

  test('query task', async () => {
    const query = `
      query task($id: Int){
        task(id: $id) {
          id
          desc
          completed
        }
      }`;

    const data = await helpers.executeQuery(query, { id: 1 }, 200);

    expect(data.data.task.id).toBe(1);
  });

  test('mutation addTask', async () => {
    const mutation = `
      mutation addTask($desc: String!) {
        addTask(desc: $desc) {
          task{
            id
            desc
            completed
          }
        }
      }
    `;

    const data = await helpers.executeMutation(mutation, { desc: 'an apple' }, 200);
    expect(data.data.addTask.task.desc).toBe('an apple');
  });

  test('mutation completeTask', async () => {
    const mutation = `
      mutation completeTask($id: Int!) {
        completeTask(id: $id) {
          task{
            id
            desc
            completed
          }
        }
      }
    `;

    const data = await helpers.executeMutation(mutation, { id: 1 }, 200);

    expect(data.data.completeTask.task.completed).toBe(true);
  });

  test('mutation deleteTask', async () => {
    const mutation = `
    mutation deleteTask($id: Int!) {
      deleteTask(id: $id) {
        task{
          id
          desc
          completed
        }
      }
    }
    `;

    const data = await helpers.executeMutation(mutation, { id: 1 }, 200);

    expect(data.data.deleteTask.task.id).toBe(1);
  });
});
