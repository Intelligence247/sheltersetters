const express = require("express")
const { body, param } = require("express-validator")

const { getAdmins, createAdminAccount, changeAdminRole } = require("../controllers/admin-management.controller")
const validateRequest = require("../middleware/validate-request")
const { authenticate, authorize } = require("../middleware/auth")

const router = express.Router()

router.use(authenticate, authorize("super_admin"))

router.get("/", getAdmins)

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role").isIn(["super_admin", "content_manager", "customer_care"]).withMessage("Invalid admin role"),
  ],
  validateRequest,
  createAdminAccount
)

router.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Valid admin id is required"),
    body("role").optional().isIn(["super_admin", "content_manager", "customer_care"]).withMessage("Invalid admin role"),
    body("isActive").optional().isBoolean().withMessage("isActive must be a boolean value"),
  ],
  validateRequest,
  changeAdminRole
)

module.exports = router

