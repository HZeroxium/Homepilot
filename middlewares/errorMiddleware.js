// middlewares/errorMiddleware.js

const createError = require("http-errors");

// Middleware xử lý lỗi 404
function notFoundHandler(req, res, next) {
  next(createError(404, "Page not found"));
}

// Middleware xử lý tất cả các lỗi
function errorHandler(err, req, res, next) {
  const statusCode = err.status || 500;

  // Ghi log lỗi (có thể thêm logger như Winston để ghi log ra file)
  console.error(`[${new Date().toISOString()}] ${statusCode} - ${err.message}`);

  // Phân tích lỗi và render trang phù hợp
  if (statusCode === 404) {
    res.status(404).render("errors/404", {
      title: "Page Not Found",
      message:
        err.message || "Sorry, the page you are looking for does not exist.",
    });
  } else {
    res.status(statusCode).render("errors/500", {
      title: "Internal Server Error",
      message: err.message || "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === "development" ? err : {}, // Hiển thị chi tiết lỗi chỉ trong môi trường dev
    });
  }
}

module.exports = { notFoundHandler, errorHandler };
