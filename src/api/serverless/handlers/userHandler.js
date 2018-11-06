/* eslint-disable no-param-reassign */
const app = require('../routes/userRoutes');
const { withDb } = require('../helper');

const handler = (event, context) => app.run(event, context);

module.exports.handler = withDb(handler);