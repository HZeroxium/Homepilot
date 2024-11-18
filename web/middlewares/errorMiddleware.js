// middlewares/errorMiddleware.js

import createError from "http-errors";

/**
 * Middleware to handle 404 errors.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
function notFoundHandler(req, res, next) {
  // Create a 404 error with a message
  const err = createError(404, "Page not found");

  // Pass the error to the next middleware function
  next(err);
}

/**
 * Middleware function to handle errors.
 * @param {Object} err - The error object.
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;

  // Log the error details (consider using a logger like Winston for file logging)
  console.error(`[${new Date().toISOString()}] ${statusCode} - ${err.message}`);

  // Check the error status and render the appropriate error page
  if (statusCode === 404) {
    // Render the 404 error page if the status code is 404
    res.status(404).render("errors/404", {
      title: "Page Not Found",
      message:
        err.message || "Sorry, the page you are looking for does not exist.",
    });
  } else {
    // Render the 500 error page for other error statuses
    res.status(statusCode).render("errors/500", {
      title: "Internal Server Error",
      message: err.message || "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === "development" ? err : {}, // Show error details only in development mode
    });
  }
}

export { notFoundHandler, errorHandler };
