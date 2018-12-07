const request = require('supertest');

const { Test } = request;
Test.prototype.authenticate = function authenticate(token) {
  return this.set('Authentication', `Bearer ${token}`);
};

function graphqlRequest(path, supertest) {
  return (expressApp) => {
    const agent = supertest(expressApp);
    agent.postQuery = function query(queryString, variables) {
      return this.post(path).send({ query: queryString, variables });
    };
    agent.postMutation = function mutation(mutationString, variables) {
      return this.post(path).send({ query: mutationString, variables });
    };
    return agent;
  };
}

module.exports = graphqlRequest;
