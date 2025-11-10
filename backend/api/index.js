const app = require("../src/app")
const { connectDatabase } = require("../src/config/database")

module.exports = async (req, res) => {
  await connectDatabase()
  return app(req, res)
}

