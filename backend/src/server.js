const http = require("http")

const app = require("./app")
const { connectDatabase, disconnectDatabase } = require("./config/database")
const config = require("./config")
const { log, error: logError } = require("./utils/logger")

let httpServer

const startServer = async () => {
  try {
    await connectDatabase()
    httpServer = http.createServer(app)

    httpServer.listen(config.port, () => {
      log(`🚀 Server ready on http://localhost:${config.port}`)
    })
  } catch (error) {
    logError("Failed to start server:", error.message)
    process.exit(1)
  }
}

const shutdown = async (signal, exitCode = 0) => {
  log(`${signal} received. Shutting down gracefully.`)
  try {
    if (httpServer) {
      await new Promise((resolve) => httpServer.close(resolve))
      log("HTTP server closed.")
    }
    await disconnectDatabase()
  } catch (err) {
    logError("Error during shutdown:", err)
    exitCode = 1
  } finally {
    process.exit(exitCode)
  }
}

if (!process.env.VERCEL) {
  startServer()

  process.on("unhandledRejection", (reason) => {
    logError("Unhandled Rejection:", reason)
    shutdown("unhandledRejection", 1)
  })

  process.on("SIGINT", () => {
    shutdown("SIGINT")
  })

  process.on("SIGTERM", () => {
    shutdown("SIGTERM")
  })
}

module.exports = {
  startServer,
}