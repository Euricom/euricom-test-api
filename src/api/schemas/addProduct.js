const addProductSchema = {
  type: 'object',
  properties: {
    quantity: {
      type: 'number',
      optional: true,
    },
  },
};

module.exports = addProductSchema;
