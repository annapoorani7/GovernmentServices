/**
 * Centralized Express Error Handling Middleware
 * Handles Mongoose validation errors, CastErrors, duplicate key errors, and server errors.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error details for developer debugging in non-production environments
  if (process.env.NODE_ENV !== "production") {
    console.error(" Error:", err);
  }

  // 1. Mongoose Bad ObjectId / CastError
  if (err.name === "CastError") {
    const message = `Invalid resource ID format: ${err.value}`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // 2. Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue ? err.keyValue[field] : "";
    const message = `Duplicate value entered for '${field}': "${value}". Please use another value.`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // 3. Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // 4. General / Custom Application Errors (e.g. 404 Not Found)
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== "production" && err.stack ? { stack: err.stack } : {}),
  });
};

export default errorHandler;
