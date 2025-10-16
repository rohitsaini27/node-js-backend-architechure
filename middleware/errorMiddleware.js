import ApiError from "../core/ApiError.js";
import ErrorTypes from "../core/ErrorType.js";
import logger from "../core/Logger.js";

const environment = process.env.NODE_ENV || "development";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    logger.error(
      `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
    );
    logger.error(err.stack);

    if (environment === "development") {
      return res.status(err.statusCode).json({
        type: err.type,
        message: err.message,
        stack: err.stack,
        details: err.details || null,
      });
    }

    return ApiError.handle(err, res);
  }

  // Fallback for unknown errors
  logger.error(err.stack || err);
  const internalError = new ApiError(500, "Internal Server Error", {
    type: ErrorTypes.INTERNAL_SERVER,
  });
  return ApiError.handle(internalError, res);
};

export default errorHandler;




































// const errorHandler = (err, req, res, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode
//   let message = err.message
//   if (err.name === "CastError" && err.kind === "ObjectId") {
//     message = "Resource Not Found"
//     statusCode = 404
//   }
//   res.status(statusCode)
//   res.json({
//     message: message,
//     stack: process.env.NODE_ENV === "development" ? err.stack : null,
//   })
// }

// const notFound = (req, res, next) => {
//   const error = new Error(`Not Found: ${req.originalUrl}`)
//   res.status(404)
//   next(error)
// }

// export { errorHandler, notFound }
