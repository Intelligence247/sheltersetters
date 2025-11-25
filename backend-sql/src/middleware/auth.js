const jwt = require("jsonwebtoken")
const ApiError = require("../utils/api-error")
const config = require("../config")

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies?.token
    if (!authHeader) {
      throw new ApiError(401, "Authentication credentials missing")
    }

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader
    const decoded = jwt.verify(token, config.jwt.secret)

    // Fetch admin from database using models available in app.locals
    const models = req.app.locals.models
    if (!models || !models.Admin) {
      throw new ApiError(401, "Database not initialized")
    }

    const admin = await models.Admin.findByPk(decoded.id, { attributes: { exclude: ["password"] } })
    
    if (!admin || !admin.isActive) {
      throw new ApiError(401, "Invalid authentication credentials")
    }

    if (decoded.version !== undefined && decoded.version !== admin.refreshTokenVersion) {
      throw new ApiError(401, "Token revoked")
    }

    req.user = admin.toJSON()
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
