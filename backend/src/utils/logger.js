const config = require("../config")

const log = (...args) => {
  if (config.env !== "test") {
    console.log(...args) // eslint-disable-line no-console
  }
}

const error = (...args) => {
  if (config.env !== "test") {
    console.error(...args) // eslint-disable-line no-console
  }
}

module.exports = {
  log,
  error,
}

