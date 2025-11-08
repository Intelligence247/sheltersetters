const jwt = require("jsonwebtoken")
const ApiError = require("../utils/api-error")
const config = require("../config")
const Admin = require("../models/admin.model")

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies?.token
    if (!authHeader) {
      throw new ApiError(401, "Authentication credentials missing")
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader
    const decoded = jwt.verify(token, config.jwt.secret)

    const admin = await Admin.findById(decoded.id).select("-password")
    if (!admin || !admin.isActive) {
      throw new ApiError(401, "Invalid authentication credentials")
    }

    req.user = admin
    next()
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"))
  }
}

const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Unauthenticated"))
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return next(new ApiError(403, "Insufficient permissions"))
    }

    return next()
  }
}

module.exports = {
  authenticate,
  authorize,
}

