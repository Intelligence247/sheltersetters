const jwt = require("jsonwebtoken")
const config = require("../config")

const signAccessToken = (payload, options = {}) =>
  jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    ...options,
  })

const verifyAccessToken = (token) => jwt.verify(token, config.jwt.secret)

const signRefreshToken = (payload, options = {}) =>
  jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    ...options,
  })

const verifyRefreshToken = (token) => jwt.verify(token, config.jwt.refreshSecret)

module.exports = {
  signToken: signAccessToken,
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
}

