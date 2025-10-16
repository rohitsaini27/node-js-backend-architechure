import ErrorTypes from "./ErrorType.js";

class ApiError extends Error {
  constructor(statusCode, message, options = {}) {
    super(message);
    this.statusCode = statusCode;
    this.type = options.type || ErrorTypes.INTERNAL_SERVER;
    this.details = options.details || null;
    this.redirectTo = options.redirectTo || undefined;

    Error.captureStackTrace(this, this.constructor);
  }

  static handle(err, res) {
    return res.status(err.statusCode || 500).json({
      type: err.type || ErrorTypes.INTERNAL_SERVER,
      message: err.message || "Internal Server Error",
      details: err.details || null,
    });
  }
}

export default ApiError;
