const express = require("express")

const { authenticate, authorize } = require("../middleware/auth")
const { uploadImage: uploadImageMiddleware } = require("../middleware/upload")
const { uploadImage } = require("../controllers/upload-local.controller")

const router = express.Router()

router.post(
  "/",
  authenticate,
  authorize("super_admin", "content_manager"),
  uploadImageMiddleware,
  uploadImage
)

module.exports = router
