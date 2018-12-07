const supertest = require('supertest');
const gqltest = require('../../../test/gqltest');
const app = require('../../express');
const tasksData = require('../../data/tasks');

const request = gqltest('/graphql', supertest);
const agent = request(app);

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

    const res = await agent.postQuery(query, {});

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.tasks.length).toBeGreaterThan(0);
    expect(res.body.data).toMatchSnapshot();
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

    const res = await agent.postQuery(query, { id: 1 });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.task.id).toBe(1);
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

    const res = await agent.postMutation(mutation, { desc: 'an apple' });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.addTask.task.desc).toBe('an apple');
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

    const res = await agent.postMutation(mutation, { id: 1 });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.completeTask.task.completed).toBe(true);
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

    const res = await agent.postMutation(mutation, { id: 1 });

    // assert
    expect(res).toHaveStatus(200);
    expect(res.body.data.deleteTask.task.id).toBe(1);
  });
});
