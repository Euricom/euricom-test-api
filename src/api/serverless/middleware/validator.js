const inspector = require('schema-inspector');

const validate = async (validationSchema, body) => {
  const result = await inspector.validate(validationSchema, body);
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

    return errorArray;
  }
};

module.exports = validate;
