const express = require("express")
const { body } = require("express-validator")
const { register, login, me, refresh, logout, forgot, reset } = require("../controllers/auth.controller")
const validateRequest = require("../middleware/validate-request")
const { authenticate } = require("../middleware/auth")
const config = require("../config")

const router = express.Router()

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("role").optional().isIn(["admin", "editor", "viewer"]).withMessage("Invalid role supplied"),
    body("registrationSecret")
      .if(() => Boolean(config.admin.registrationSecret))
      .notEmpty()
      .withMessage("Registration secret is required"),
  ],
  validateRequest,
  register
)

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validateRequest,
  login
)

router.get("/me", authenticate, me)

router.post(
  "/refresh",
  [body("refreshToken").notEmpty().withMessage("Refresh token is required")],
  validateRequest,
  refresh
)

router.post("/logout", authenticate, logout)

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Valid email is required").normalizeEmail(), body("baseUrl").optional().isURL()],
  validateRequest,
  forgot
)

router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  validateRequest,
  reset
)

module.exports = router

