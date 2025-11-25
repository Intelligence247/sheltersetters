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

const toPlain = (documents) =>
  documents.map((doc) => {
    const plain = typeof doc.toJSON === "function" ? doc.toJSON() : doc
    if (plain && !plain._id && plain.id) {
      plain._id = plain.id
    }
    return plain
  })

const fetchServices = async (models) => {
  const services = await models.Service.findAll({
    where: { isActive: true },
    // Use snake_case timestamps that exist in the SQL schema
    order: [["order", "ASC"], ["created_at", "ASC"]],
  })
  if (!services.length) {
    return defaultServices
  }
  return toPlain(services)
}

const fetchNews = async (models) => {
  const news = await models.NewsArticle.findAll({
    order: [["publishedAt", "DESC"]],
  })
  if (!news.length) {
    return defaultNews
  }
  return toPlain(news)
}

const fetchProjects = async (models) => {
  const projects = await models.Project.findAll({
    where: { isFeatured: true },
    order: [["order", "ASC"], ["created_at", "DESC"]],
  })
  if (!projects.length) {
    return defaultProjects
  }
  return toPlain(projects)
}

const fetchTeam = async (models) => {
  const members = await models.TeamMember.findAll({
    where: { isActive: true },
    order: [["order", "ASC"], ["created_at", "ASC"]],
  })
  if (!members.length) {
    return defaultTeamMembers
  }
  return toPlain(members)
}

const getHomeContent = async (models) => {
  const [services, news, projects, team] = await Promise.all([
    fetchServices(models),
    fetchNews(models),
    fetchProjects(models),
    fetchTeam(models),
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
