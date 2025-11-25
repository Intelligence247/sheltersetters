process.env.NODE_ENV = process.env.NODE_ENV || 'test'
process.env.DB_DIALECT = 'sqlite'
process.env.DB_STORAGE = ':memory:'
process.env.UPLOAD_DIR = 'public/uploads'
process.env.ADMIN_REGISTRATION_SECRET = process.env.ADMIN_REGISTRATION_SECRET || 'test-secret'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt'

const { connectDatabase, disconnectDatabase } = require('../src/config/database')
const { app, addRoutes } = require('../src/app')
const { notFoundHandler, errorHandler } = require('../src/middleware/error-handlers')

const fs = require('fs')
const path = require('path')

const setupApp = async () => {
  const { sequelize, models } = await connectDatabase()
  app.locals.sequelize = sequelize
  app.locals.models = models
  const routes = require('../src/routes')
  addRoutes(routes)
  // Attach error handlers after routes (mirrors server.js behavior)
  app.use(notFoundHandler)
  app.use(errorHandler)
  // Ensure uploads dir exists
  const uploadsDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads')
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
  return { app, models, sequelize }
}

const teardown = async () => {
  try {
    await disconnectDatabase()
  } catch (err) {
    console.error('Error during teardown', err)
  }
}

module.exports = { setupApp, teardown }
