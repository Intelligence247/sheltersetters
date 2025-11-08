const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Resource not found: ${req.originalUrl}`,
  })
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  res.status(status).json({
    status: "error",
    message: err.message || "Internal Server Error",
  })
}

module.exports = {
  notFoundHandler,
  errorHandler,
}

