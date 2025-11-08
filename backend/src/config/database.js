const mongoose = require("mongoose")

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined")
  }

  await mongoose.connect(mongoUri)
  return mongoose.connection
}

module.exports = connectDatabase

