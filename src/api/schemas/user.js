const userSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    age: {
      type: 'number',
    },
    email: {
      type: 'string',
    },
    role: {
      type: 'string',
    },
  },
};

module.exports = userSchema;
