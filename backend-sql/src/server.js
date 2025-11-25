const http = require("http")

const { app, addRoutes } = require("./app")
const { connectDatabase, disconnectDatabase } = require("./config/database")
const config = require("./config")
const { log, error: logError } = require("./utils/logger")

let httpServer

const startServer = async () => {
  try {
    const { sequelize, models } = await connectDatabase()
    
    // Make models available globally for middleware
    app.locals.sequelize = sequelize
    app.locals.models = models

    // Now import and add routes
    const routes = require("./routes")
    addRoutes(routes)

    // Attach notFound and error handlers after routes are mounted
    const { notFoundHandler, errorHandler } = require("./middleware/error-handlers")
    app.use(notFoundHandler)
    app.use(errorHandler)

    httpServer = http.createServer(app)

    httpServer.listen(config.port, () => {
      log(`🚀 Server ready on http://localhost:${config.port}`)
    })
  } catch (error) {
    logError("Failed to start server:", error.message)
    logError(error.stack)
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