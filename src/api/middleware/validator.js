const inspector = require('schema-inspector');
const { BadRequestError } = require('../../httpErrors');

const validate = validationSchema => (req, res, next) => {
  const result = inspector.validate(validationSchema, req.body);

  if (!result.valid) {
    const errorArray = [];
    const errors = result.error;

    errors.map(item => {
      const objectToPush = {
        key: item.property.split('@.')[1],
        message: item.message,
      };

      errorArray.push(objectToPush);
    });

    throw new BadRequestError(errorArray);
  }

  next();
};

module.exports = validate;
