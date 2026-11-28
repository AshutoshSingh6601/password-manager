import ApiResponse from "../utils/apiResponse.js";

/**
 * Higher-order function to wrap async controller routes and forward errors to centralized handler
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * 404 Not Found Handler for unmatched routes
 */
export const notFoundHandler = (req, res) => {
  return ApiResponse.error(res, `Route ${req.originalUrl} not found`, 404);
};

/**
 * Centralized Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Prevent sending duplicate headers if response has already started
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";
  let errors = [];

  // Mongoose Bad ObjectId / CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field '${err.path}'`;
    errors = [{ field: err.path, message: `Invalid identifier: ${err.value}` }];
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors || {}).map((e) => ({
      field: e.path,
      message: e.message
    }));
  }

  // MongoDB Duplicate Key Error (e.g. unique username or email)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedKeys = Object.keys(err.keyValue || {});
    const fieldName = duplicatedKeys.join(", ") || "field";
    message = `Duplicate key error: '${fieldName}' already exists`;
    errors = duplicatedKeys.map((key) => ({
      field: key,
      message: `${key} is already taken`
    }));
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Session expired. Please log in again";
  }

  // Hide internal server error details in production
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "An unexpected error occurred on the server";
    errors = [];
  }

  return ApiResponse.error(res, message, statusCode, errors);
};
