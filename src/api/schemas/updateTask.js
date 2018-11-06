const updateTaskSchema = {
  type: 'object',
  properties: {
    completed: {
      type: 'boolean',
    },
  },
};

module.exports = updateTaskSchema;
