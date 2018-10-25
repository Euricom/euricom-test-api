const inspector = require('schema-inspector');
const { BadRequestError } = require('../../../httpErrors');

module.exports = (schema) => ({
  before: (handler, next) => {
    console.log(handler.event);
    const result = inspector.validate(schema, handler.event.body);
    console.log(result.error);

    if (!result.valid) {
      const errorArray = [];
      const errors = result.error;

      errors.map((item) => {
        const objectToPush = {
          key: item.property.split('@.')[1],
          message: item.message,
        };

        errorArray.push(objectToPush);
      });

      throw new BadRequestError(errorArray);
    }

    return next();
  },
});
