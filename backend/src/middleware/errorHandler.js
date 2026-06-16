const errorHandler = (err, req, res, next) => {
  const error = {
    message: err.message || "Internal Server Error",
    status: err.status || 500,
  };

  // Log error
  console.error("Error:", {
    message: error.message,
    status: error.status,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Send error response
  res.status(error.status).json({
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
