const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const compression = require("compression")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const swaggerUi = require("swagger-ui-express")

const config = require("./config")
const { notFoundHandler, errorHandler } = require("./middleware/error-handlers")

const path = require("path")
const app = express()

app.set("trust proxy", 1)

app.use(
  cors({
    origin: config.cors.origin.length > 0 ? config.cors.origin : "*",
    credentials: config.cors.credentials,
  })
)

// Configure Helmet to allow images and static assets
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "http://localhost:*", "https://*", "http://*"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
  })
)

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

app.get("/status", (_req, res) => {
  res.json({ status: "ok" })
})

// Serve uploaded files from public uploads directory (config.uploads.dir)
// Add CORS headers explicitly for static files
const uploadsDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || "public/uploads")
app.use(
  "/uploads",
  (req, res, next) => {
    // Set CORS headers for static files
    const origin = req.headers.origin
    if (origin && (config.cors.origin.includes(origin) || config.cors.origin.includes("*"))) {
      res.setHeader("Access-Control-Allow-Origin", origin)
      res.setHeader("Access-Control-Allow-Credentials", "true")
    }
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable")
    next()
  },
  express.static(uploadsDir, {
    setHeaders: (res, filePath) => {
      // Ensure proper content-type for images
      if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg")
      } else if (filePath.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png")
      } else if (filePath.endsWith(".webp")) {
        res.setHeader("Content-Type", "image/webp")
      } else if (filePath.endsWith(".gif")) {
        res.setHeader("Content-Type", "image/gif")
      }
    },
  })
)

// Routes will be added here by server.js
const addRoutes = (routes) => {
  console.log('Adding API routes')
  app.use("/api", routes)
  console.log('API routes added')
  try {
    if (app._router && app._router.stack) {
      const builtRoutes = app._router.stack
        .filter((r) => r.name === 'router')
        .map((r) => (r.regexp && r.regexp.toString()) || r.route)
      console.log('Registered router stacks:', builtRoutes)
    } else {
      console.log('No router stack yet')
    }
  } catch (err) {
    console.error('Failed to list routes', err)
  }
}

// notFoundHandler and errorHandler need to be registered after routes are mounted
// (server.js will call addRoutes and then attach the handlers so they run last)

module.exports = {
  app,
  addRoutes,
}
