module.exports = (err, req, res, next) => {
  // Default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // If error is NOT operational (unexpected bug)
  if (!err.isOperational) {
    statusCode = 500;
    message = "Internal server error";
  }

  // Development mode → show detailed error
  if (process.env.NODE_ENV !== "production") {
    return res.status(statusCode).json({
      status: err.status || "error",
      message,
      stack: err.stack
    });
  }

  // Production mode → safe response
  res.status(statusCode).json({
    status: err.status || "error",
    message
  });
};