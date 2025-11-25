const ApiError = require("../utils/api-error")
const { error: logError } = require("../utils/logger")

const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Resource not found: ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || err.status || 500
  const message = err.message || "Internal Server Error"
  const errors = err.errors || []

  logError("Unhandled error:", err)

  res.status(status).json({
    status: "error",
    message,
    errors,
  })
}

module.exports = {
  notFoundHandler,
  errorHandler,
}
