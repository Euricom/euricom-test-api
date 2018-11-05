/* eslint-disable no-param-reassign */
const db = require('./../../dbConnection');

const withParse = (handler) => async (event, context) => {
  const response = await handler(event, context);
  const parsedResponse = {
    ...response,
    body: JSON.parse(response.body),
  };
  return parsedResponse;
};

const withDb = (handler) => async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await db.connectToDb();
    return handler(event, context);
  } catch (ex) {
    return ex;
  }
};

module.exports = { withParse, withDb };
