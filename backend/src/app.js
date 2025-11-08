const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const swaggerUi = require("swagger-ui-express")

const routes = require("./routes")
const config = require("./config")
const { notFoundHandler, errorHandler } = require("./middleware/error-handlers")
const swaggerDocument = require("./docs/swagger.json")

const app = express()

app.set("trust proxy", 1)

app.use(
  cors({
    origin: config.cors.origin.length > 0 ? config.cors.origin : "*",
    credentials: config.cors.credentials,
  })
)
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(
  rateLimit({
    windowMs: config.security.rateLimitWindowMs,
    max: config.security.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  })
)

app.use(
  morgan(config.env === "production" ? "combined" : "dev", {
    skip: () => config.env === "test",
  })
)

app.get("/swagger.json", (_req, res) => {
  res.json(swaggerDocument)
})

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
    customSiteTitle: "Shelter Setters API Docs",
  })
)

app.get("/status", (_req, res) => {
  res.json({ status: "ok" })
})

app.use("/api", routes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app

