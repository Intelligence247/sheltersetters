const { Sequelize } = require("sequelize")
const { log, error: logError } = require("../utils/logger")

const dbName = process.env.DB_NAME
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbHost = process.env.DB_HOST || "localhost"
const dbDialect = process.env.DB_DIALECT || "mysql"
const dbStorage = process.env.DB_STORAGE || ":memory:"

if (dbDialect === 'sqlite') {
  log(`[DB Config] Connecting to sqlite in memory/storage: ${dbStorage}`)
} else {
  log(`[DB Config] Connecting to ${dbDialect}://${dbHost}/${dbName} as ${dbUser}`)
}

// For sqlite, username/password are not required
if (dbDialect !== 'sqlite' && (!dbName || !dbUser || !dbPass)) {
  logError("Missing required database env vars:")
  logError(`  DB_NAME: ${dbName ? "✓" : "✗ MISSING"}`)
  logError(`  DB_USER: ${dbUser ? "✓" : "✗ MISSING"}`)
  logError(`  DB_PASS: ${dbPass ? "✓ (length: " + dbPass.length + ")" : "✗ MISSING"}`)
  logError(`  DB_HOST: ${dbHost ? "✓" : "✗ MISSING"}`)
  throw new Error("Database configuration incomplete")
}

let sequelize
if (dbDialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbStorage,
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  })
} else {
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    dialect: dbDialect,
    logging: false,
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  })
}

const initModels = require("../models")

const connectDatabase = async () => {
  try {
    await sequelize.authenticate()
    log("Connected to MySQL database")
    const models = initModels(sequelize)
    
    // Check if tables already exist to avoid index creation issues
    const queryInterface = sequelize.getQueryInterface()
    const tableNames = ['admins', 'contact_messages', 'news_articles', 'projects', 'services', 'team_members']
    const existingTables = await queryInterface.showAllTables()
    const tablesExist = tableNames.every(table => existingTables.includes(table))
    
    if (tablesExist) {
      log("Database tables already exist, skipping sync")
    } else {
      log("Creating database tables...")
      // Only create tables if they don't exist (no alter to avoid index issues)
      await sequelize.sync({ force: false, alter: false })
      log("Database tables created")
    }
    
    return { sequelize, models }
  } catch (err) {
    logError("Failed to connect to MySQL:", err.message)
    logError("Stack:", err.stack)
    throw err
  }
}

const disconnectDatabase = async () => {
  try {
    await sequelize.close()
    log("MySQL connection closed")
  } catch (err) {
    logError("Error closing database:", err.message)
  }
}

module.exports = {
  sequelize,
  connectDatabase,
  disconnectDatabase,
}
