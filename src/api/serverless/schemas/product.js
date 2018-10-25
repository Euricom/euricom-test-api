const productSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'number',
      optional: true,
    },
    sku: {
      type: 'string',
    },
    title: {
      type: 'string',
    },
    desc: {
      type: 'string',
      optional: true,
    },
    image: {
      type: 'string',
      optional: true,
    },
    stocked: {
      type: 'boolean',
      optional: true,
    },
    basePrice: {
      type: 'number',
    },
    price: {
      type: 'number',
      optional: true,
    },
  },
};

module.exports = productSchema;
