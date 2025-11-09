const express = require("express")
const { body, param } = require("express-validator")
const {
  listServices,
  createService,
  updateService,
  deleteService,
  listNews,
  createNews,
  updateNews,
  deleteNews,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  listTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/admin-content.controller")
const validateRequest = require("../middleware/validate-request")
const { authenticate, authorize } = require("../middleware/auth")

const router = express.Router()

router.use(authenticate, authorize("admin", "editor"))

// Services
router.get("/services", listServices)
router.post(
  "/services",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    body("summary").notEmpty().withMessage("Summary is required"),
    body("order").optional().isInt({ min: 0 }).withMessage("Order must be a positive integer"),
  ],
  validateRequest,
  createService
)
router.patch(
  "/services/:id",
  [
    param("id").isMongoId().withMessage("Valid id is required"),
    body("order").optional().isInt({ min: 0 }).withMessage("Order must be a positive integer"),
  ],
  validateRequest,
  updateService
)
router.delete(
  "/services/:id",
  [param("id").isMongoId().withMessage("Valid id is required")],
  validateRequest,
  deleteService
)

// News
router.get("/news", listNews)
router.post(
  "/news",
  [
    body("headline").notEmpty().withMessage("Headline is required"),
    body("summary").notEmpty().withMessage("Summary is required"),
    body("publishedAt").optional().isISO8601().toDate().withMessage("publishedAt must be a valid date"),
  ],
  validateRequest,
  createNews
)
router.patch(
  "/news/:id",
  [
    param("id").isMongoId().withMessage("Valid id is required"),
    body("publishedAt").optional().isISO8601().toDate().withMessage("publishedAt must be a valid date"),
  ],
  validateRequest,
  updateNews
)
router.delete(
  "/news/:id",
  [param("id").isMongoId().withMessage("Valid id is required")],
  validateRequest,
  deleteNews
)

// Projects
router.get("/projects", listProjects)
router.post(
  "/projects",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("slug").notEmpty().withMessage("Slug is required"),
    body("summary").notEmpty().withMessage("Summary is required"),
    body("completedAt").optional().isISO8601().toDate().withMessage("completedAt must be a valid date"),
    body("order").optional().isInt({ min: 0 }).withMessage("Order must be a positive integer"),
  ],
  validateRequest,
  createProject
)
router.patch(
  "/projects/:id",
  [
    param("id").isMongoId().withMessage("Valid id is required"),
    body("completedAt").optional().isISO8601().toDate().withMessage("completedAt must be a valid date"),
    body("order").optional().isInt({ min: 0 }).withMessage("Order must be a positive integer"),
  ],
  validateRequest,
  updateProject
)
router.delete(
  "/projects/:id",
  [param("id").isMongoId().withMessage("Valid id is required")],
  validateRequest,
  deleteProject
)

// Team
router.get("/team", listTeamMembers)
router.post(
  "/team",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("order").optional().isInt({ min: 0 }).withMessage("Order must be a positive integer"),
  ],
  validateRequest,
  createTeamMember
)
router.patch(
  "/team/:id",
  [
    param("id").isMongoId().withMessage("Valid id is required"),
    body("order").optional().isInt({ min: 0 }).withMessage("Order must be a positive integer"),
  ],
  validateRequest,
  updateTeamMember
)
router.delete(
  "/team/:id",
  [param("id").isMongoId().withMessage("Valid id is required")],
  validateRequest,
  deleteTeamMember
)

module.exports = router

