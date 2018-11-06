const app = require('../routes/basketRoutes');
const { withDb } = require('../helper');

const handler = (event, context) => app.run(event, context);

module.exports.handler = withDb(handler);
