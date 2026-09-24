/**
 * Standardized Success Response Helper
 */
export const successResponse = (res, data, message = null, statusCode = 200) => {
  const response = {
    success: true,
    ...(message && { message }),
    data,
  };
  return res.status(statusCode).json(response);
};

/**
 * Standardized Error Response Helper
 */
export const errorResponse = (res, message = "An error occurred", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
