const express = require("express")

const router = express.Router()

const healthRoutes = require("./health.routes")
const authRoutes = require("./auth.routes")
const contactRoutes = require("./contact.routes")
const contentRoutes = require("./content.routes")

router.use("/health", healthRoutes)
router.use("/auth", authRoutes)
router.use("/contact", contactRoutes)
router.use("/content", contentRoutes)

module.exports = router

