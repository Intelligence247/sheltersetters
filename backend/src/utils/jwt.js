const jwt = require("jsonwebtoken")
const config = require("../config")

const signToken = (payload, options = {}) => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    ...options,
  })
}

module.exports = {
  signToken,
}

