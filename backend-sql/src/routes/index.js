const express = require("express")

const router = express.Router()

const healthRoutes = require("./health.routes")
const authRoutes = require("./auth.routes")
const contactRoutes = require("./contact.routes")
const contentRoutes = require("./content.routes")
const adminContentRoutes = require("./admin-content.routes")
const adminUsersRoutes = require("./admin-users.routes")
const adminDashboardRoutes = require("./admin-dashboard.routes")
const uploadRoutes = require("./upload.routes")

router.use("/health", healthRoutes)
router.use("/auth", authRoutes)
router.use("/contact", contactRoutes)
router.use("/content", contentRoutes)
router.use("/admin/content", adminContentRoutes)
router.use("/admin/users", adminUsersRoutes)
router.use("/admin/dashboard", adminDashboardRoutes)
router.use("/uploads", uploadRoutes)

module.exports = router
