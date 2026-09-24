/**
 * Async handler wrapper to catch unhandled errors in async route controllers
 * and forward them automatically to Express centralized error middleware.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
