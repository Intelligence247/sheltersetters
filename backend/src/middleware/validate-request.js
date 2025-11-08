const { validationResult } = require("express-validator")
const ApiError = require("../utils/api-error")

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }))
    return next(new ApiError(422, "Validation failed", extractedErrors))
  }
  return next()
}

module.exports = validateRequest

