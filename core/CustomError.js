import ApiError from "./ApiError.js";
import ErrorTypes from "./ErrorType.js";

class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message, { type: ErrorTypes.UNAUTHORIZED });
  }
}

class BadRequestError extends ApiError {
  constructor(message = "Bad Request", errors = []) {
    super(400, message, { type: ErrorTypes.BAD_REQUEST });
    this.errors = errors;
  }
}

class NotFoundError extends ApiError {
  constructor(message = "Not Found") {
    super(404, message, { type: ErrorTypes.NOT_FOUND });
  }
}

class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message, { type: ErrorTypes.FORBIDDEN });
  }
}

class InternalServerError extends ApiError {
  constructor(message = "Internal Server Error") {
    super(500, message, { type: ErrorTypes.INTERNAL_SERVER });
  }
}

class TokenExpiredError extends ApiError {
  constructor(message = "Token Expired") {
    super(401, message, { type: ErrorTypes.TOKEN_EXPIRED });
  }
}

class BadTokenError extends ApiError {
  constructor(message = "Bad Token") {
    super(401, message, { type: ErrorTypes.BAD_TOKEN });
  }
}

class AccessTokenError extends ApiError {
  constructor(message = "Access Token Error") {
    super(401, message, { type: ErrorTypes.ACCESS_TOKEN_ERROR });
  }
}

export {
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  InternalServerError,
  TokenExpiredError,
  BadTokenError,
  AccessTokenError,
};
