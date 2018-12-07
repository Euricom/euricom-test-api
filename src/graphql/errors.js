const { ApolloError } = require('apollo-server-express');

class BusinessRuleError extends ApolloError {
  constructor(message, code = 'BUSINESS_RULE_ERROR', properties = null) {
    super(message, code, properties);
    Object.defineProperty(this, 'name', { value: 'BusinessRuleError' });
  }
}

module.exports = {
  BusinessRuleError,
};
