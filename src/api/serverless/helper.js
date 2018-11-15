/* eslint-disable no-param-reassign */
const db = require('./../../dbConnection');

const createError = (status, body) => ({
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  statusCode: status || 500,
  body: JSON.stringify(body),
});

const withParse = (handler) => async (event, context) => {
  const response = await handler(event, context);
  const parsedResponse = {
    ...response,
    body: response.body ? JSON.parse(response.body) : null,
  };
  return parsedResponse;
};

const withDb = (handler) => async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await db.connectToDb();
    return handler(event, context);
  } catch (ex) {
    return createError(ex.status, ex.stack);
  }
};

module.exports = { withParse, withDb, createError };
