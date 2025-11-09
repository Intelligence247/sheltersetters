const express = require("express")
const { body, param, query } = require("express-validator")
const rateLimit = require("express-rate-limit")
const {
  submitContactForm,
  getMessages,
  changeMessageStatus,
  replyToContactMessage,
} = require("../controllers/contact.controller")
const validateRequest = require("../middleware/validate-request")
const { authenticate, authorize } = require("../middleware/auth")

const router = express.Router()

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
})

router.post(
  "/",
  contactLimiter,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("phone").optional().trim().isLength({ min: 6 }).withMessage("Phone number is too short"),
    body("message").trim().isLength({ min: 10 }).withMessage("Message should be at least 10 characters"),
  ],
  validateRequest,
  submitContactForm
)

router.get(
  "/",
  authenticate,
  authorize("admin", "editor"),
  [
    query("status").optional().isIn(["new", "in_progress", "closed"]).withMessage("Invalid status value"),
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  ],
  validateRequest,
  getMessages
)

router.patch(
  "/:id",
  authenticate,
  authorize("admin", "editor"),
  [
    param("id").isMongoId().withMessage("Valid message id is required"),
    body("status").optional().isIn(["new", "in_progress", "closed"]).withMessage("Invalid status"),
    body("notes").optional().isString(),
  ],
  validateRequest,
  changeMessageStatus
)

router.post(
  "/:id/reply",
  authenticate,
  authorize("admin", "editor"),
  [
    param("id").isMongoId().withMessage("Valid message id is required"),
    body("reply").isLength({ min: 5 }).withMessage("Reply must be at least 5 characters"),
    body("status").optional().isIn(["new", "in_progress", "closed"]).withMessage("Invalid status"),
  ],
  validateRequest,
  replyToContactMessage
)

module.exports = router

