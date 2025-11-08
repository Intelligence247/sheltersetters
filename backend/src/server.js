require("dotenv").config()

const http = require("http")

const app = require("./app")
const connectDatabase = require("./config/database")

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDatabase()
    const server = http.createServer(app)

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Server ready on http://localhost:${PORT}`)
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server:", error.message)
    process.exit(1)
  }
}

startServer()

process.on("unhandledRejection", (reason) => {
  // eslint-disable-next-line no-console
  console.error("Unhandled Rejection:", reason)
  process.exit(1)
})

process.on("SIGINT", () => {
  // eslint-disable-next-line no-console
  console.log("Received SIGINT. Shutting down gracefully.")
  process.exit(0)
})

