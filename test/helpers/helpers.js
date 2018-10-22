const request = require('supertest');
const app = require('../../src/express');

const executeQuery = (query, variables, expectedStatus) => {
  return request(app.app)
    .post('/graphql')
    .send({ query, variables })
    .then((res) => {
      if (res.status != expectedStatus) {
        console.error('Response:', res.body);
      }
      expect(res.status).toBe(expectedStatus);
      return res.body;
    });
};

const executeMutation = (mutation, variables, expectedStatus) => {
  return request(app.app)
    .post('/graphql')
    .send({ query: mutation, variables })
    .then((res) => {
      if (res.status != expectedStatus) {
        console.error('Response:', res.body);
      }
      expect(res.status).toBe(expectedStatus);
      return res.body;
    });
};

module.exports = { executeMutation, executeQuery };
