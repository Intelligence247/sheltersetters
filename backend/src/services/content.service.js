const Service = require("../models/service.model")
const NewsArticle = require("../models/news-article.model")
const Project = require("../models/project.model")
const TeamMember = require("../models/team-member.model")
const {
  defaultServices,
  defaultNews,
  defaultProjects,
  defaultTeamMembers,
} = require("../constants/default-content")

const toPlain = (documents) => documents.map((doc) => (typeof doc.toObject === "function" ? doc.toObject() : doc))

const fetchServices = async () => {
  const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 })
  if (!services.length) {
    return defaultServices
  }
  return toPlain(services)
}

const fetchNews = async () => {
  const news = await NewsArticle.find().sort({ publishedAt: -1 })
  if (!news.length) {
    return defaultNews
  }
  return toPlain(news)
}

const fetchProjects = async () => {
  const projects = await Project.find({ isFeatured: true }).sort({ order: 1, createdAt: -1 })
  if (!projects.length) {
    return defaultProjects
  }
  return toPlain(projects)
}

const fetchTeam = async () => {
  const members = await TeamMember.find({ isActive: true }).sort({ order: 1, createdAt: 1 })
  if (!members.length) {
    return defaultTeamMembers
  }
  return toPlain(members)
}

const getHomeContent = async () => {
  const [services, news, projects, team] = await Promise.all([
    fetchServices(),
    fetchNews(),
    fetchProjects(),
    fetchTeam(),
  ])

  return {
    services,
    news,
    projects,
    team,
  }
}

module.exports = {
  getHomeContent,
  fetchServices,
  fetchNews,
  fetchProjects,
  fetchTeam,
}

