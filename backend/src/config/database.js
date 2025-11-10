const mongoose = require("mongoose")

const config = require(".")
const { log, error: logError } = require("../utils/logger")

let memoryServer
let MongoMemoryServerModule
const globalState = global

if (!globalState.__sheltersettersMongo) {
  globalState.__sheltersettersMongo = {
    connection: null,
    promise: null,
  }
}

const cached = globalState.__sheltersettersMongo

const connectWithUri = async (uri) => {
  const connection = await mongoose.connect(uri, {
    autoIndex: config.env !== "production",
    bufferCommands: false,
  })
  log(`Connected to MongoDB${memoryServer ? " (in-memory)" : ""}`)
  return connection
}

const ensureMemoryServerModule = () => {
  if (!MongoMemoryServerModule) {
    try {
      // eslint-disable-next-line global-require
      MongoMemoryServerModule = require("mongodb-memory-server")
    } catch (err) {
      throw new Error(
        "mongodb-memory-server is not installed. Install it (`npm install -D mongodb-memory-server`) or disable USE_IN_MEMORY_DB."
      )
    }
  }
  return MongoMemoryServerModule.MongoMemoryServer
}

const startInMemoryServer = async () => {
  const MongoMemoryServer = ensureMemoryServerModule()
  memoryServer = await MongoMemoryServer.create()
  const uri = memoryServer.getUri()
  log("Starting in-memory MongoDB instance")
  return connectWithUri(uri)
}

const connectDatabase = async () => {
  if (cached.connection && mongoose.connection.readyState === 1) {
    return cached.connection
  }

  if (cached.promise) {
    return cached.promise
  }

  if (config.mongoUri) {
    cached.promise = connectWithUri(config.mongoUri)
      .then((connection) => {
        cached.connection = connection
        return connection
      })
      .catch((err) => {
        cached.promise = null
        logError("Failed to connect to MongoDB:", err.message)
        if (!config.useInMemoryDb) {
          throw err
        }
        log("Falling back to in-memory MongoDB instance")
        return startInMemoryServer().then((connection) => {
          cached.connection = connection
          return connection
        })
      })
    return cached.promise
  } else if (!config.useInMemoryDb) {
    throw new Error("MONGODB_URI is not defined and USE_IN_MEMORY_DB is disabled")
  }

  if (config.useInMemoryDb) {
    cached.promise = startInMemoryServer().then((connection) => {
      cached.connection = connection
      return connection
    })
    return cached.promise
  }

  throw new Error("Unable to establish a MongoDB connection")
}

const disconnectDatabase = async () => {
  await mongoose.disconnect()
  if (memoryServer) {
    await memoryServer.stop()
    memoryServer = null
    log("In-memory MongoDB instance stopped")
  }
  cached.connection = null
  cached.promise = null
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
}

