const path = require("path")
const dotenv = require("dotenv")

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
})

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback
  return ["true", "1", "yes"].includes(String(value).toLowerCase())
}

const parseNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const commaSeparatedToArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}

const environment = process.env.NODE_ENV || "development"

const config = {
  env: environment,
  port: parseNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/sheltersetters",
  cors: {
    origin: commaSeparatedToArray(process.env.CORS_ORIGIN || "http://localhost:3000"),
    credentials: true,
  },
  security: {
    rateLimitWindowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
    rateLimitMax: parseNumber(process.env.RATE_LIMIT_MAX, 100),
  },
  jwt: {
    secret: process.env.JWT_SECRET || "change-me",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseNumber(process.env.EMAIL_PORT, 587),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
    fromName: process.env.EMAIL_FROM_NAME || "Shelter Setters",
    secure: parseBoolean(process.env.EMAIL_SECURE, false),
  },
  publicUrls: {
    backend: process.env.BACKEND_PUBLIC_URL || "http://localhost:5000",
  },
  admin: {
    registrationSecret: process.env.ADMIN_REGISTRATION_SECRET,
  },
  useInMemoryDb: parseBoolean(process.env.USE_IN_MEMORY_DB, environment !== "production"),
}

module.exports = config

