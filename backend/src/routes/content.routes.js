const express = require("express")
const {
  getHome,
  getServices,
  getNews,
  getNewsArticle,
  getProjects,
  getTeam,
} = require("../controllers/content.controller")

const router = express.Router()

router.get("/home", getHome)
router.get("/services", getServices)
router.get("/news", getNews)
router.get("/news/:id", getNewsArticle)
router.get("/projects", getProjects)
router.get("/team", getTeam)

module.exports = router

