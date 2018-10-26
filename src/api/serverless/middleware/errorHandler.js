module.exports = () => ({
  onError: (handler, next) => {
    if (handler.error instanceof Error) {
      console.log(handler.error)
      handler.response = {
        statusCode: handler.error.statusCode,
        body: JSON.stringify({
          code: handler.error.statusCode,
          message: handler.error.message,
          details: handler.error.details || handler.error.payload.details,
        }),
      };
      return next();
    }

    return next(handler.error);
  },
});
