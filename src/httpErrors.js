const httpStatus = require('http-status-codes');

class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.payload = {
      code: httpStatus.getStatusText(statusCode),
      message,
    };
    if (details) {
      this.payload.details = details;
    }
  }
}

class InternalServerError extends HttpError {
  constructor(message = 'Oops, something went wrong on the server') {
    super(httpStatus.InternalServerError);
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'The resource was not found') {
    super(httpStatus.NOT_FOUND, message);
  }
}

class BadRequestError extends HttpError {
  constructor(details) {
    super(httpStatus.BAD_REQUEST, 'One or more validations failed', details);
  }
}

class UnauthorizedError extends HttpError {
  constructor(details) {
    super(httpStatus.UNAUTHORIZED, 'Unauthorized, need to ', details);
  }
}

class ForbiddenError extends HttpError {
  constructor(path = 'this resource') {
    super(
      httpStatus.FORBIDDEN,
      `Forbidden, you don't have permission to access ${path}`,
    );
  }
}

class ConflictError extends HttpError {
  constructor(message, details = null) {
    super(httpStatus.CONFLICT, message, details);
  }
}

module.exports = {
  HttpError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  InternalServerError
};
