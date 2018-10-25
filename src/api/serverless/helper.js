const createResponse = (status, body) => {
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: status,
    body: JSON.stringify(body),
  };
};

module.exports = createResponse;
