/**
 * Middleware for handling 404 Not Found routes
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

export default notFound;
