const express = require("express")

const { authenticate } = require("../middleware/auth")
const { getOverview } = require("../controllers/admin-dashboard.controller")

const router = express.Router()

router.get("/overview", authenticate, getOverview)

module.exports = router
