const { StatusCodes } = require("http-status-codes")
const { Op } = require("sequelize")
const ApiError = require("../utils/api-error")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")

const { addIdAlias, addIdAliasArray } = require("../utils/compat")
const makeResponse = (res, status, data, message = "Success") => res.status(status).json(new ApiResponse(status, data, message))

// Services
const listServices = asyncHandler(async (req, res) => {
  const services = await res.app.locals.models.Service.findAll({ order: [["order", "ASC"], ["created_at", "DESC"]] })
  const servicesPlain = services.map((s) => {
    const obj = s.toJSON()
    addIdAlias(obj)
    return obj
  })
  return makeResponse(res, StatusCodes.OK, { services: servicesPlain })
})

const createService = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  }
  const service = await res.app.locals.models.Service.create(payload)
  const svc = service.toJSON(); addIdAlias(svc)
  return makeResponse(res, StatusCodes.CREATED, { service: svc }, "Service created")
})

const updateService = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    updatedBy: req.user.id,
  }
  const service = await res.app.locals.models.Service.findByPk(req.params.id)
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found")
  }
  await service.update(payload)
  const svc2 = service.toJSON(); addIdAlias(svc2)
  return makeResponse(res, StatusCodes.OK, { service: svc2 }, "Service updated")
})

const deleteService = asyncHandler(async (req, res) => {
  const service = await res.app.locals.models.Service.findByPk(req.params.id)
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found")
  }
  await service.destroy()
  const svc3 = service.toJSON(); addIdAlias(svc3)
  return makeResponse(res, StatusCodes.OK, { service: svc3 }, "Service deleted")
})

// News
const listNews = asyncHandler(async (req, res) => {
  const news = await res.app.locals.models.NewsArticle.findAll({ order: [["publishedAt", "DESC"]] })
  const newsPlain = news.map((n) => { const obj = n.toJSON(); addIdAlias(obj); return obj })
  return makeResponse(res, StatusCodes.OK, { news: newsPlain })
})

const getNews = asyncHandler(async (req, res) => {
  const { id } = req.params
  const article = await res.app.locals.models.NewsArticle.findOne({
    where: {
      [Op.or]: [{ id }, { slug: id }],
    },
  })
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, "News article not found")
  }
  const art = article.toJSON(); addIdAlias(art)
  return makeResponse(res, StatusCodes.OK, { article: art })
})

const createNews = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  }
  if (!payload.authorName && req.user.name) {
    payload.authorName = req.user.name
  }
  const article = await res.app.locals.models.NewsArticle.create(payload)
  const articleJson = article.toJSON()
  addIdAlias(articleJson)
  return makeResponse(res, StatusCodes.CREATED, { article: articleJson }, "News article created")
})

const updateNews = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    updatedBy: req.user.id,
  }
  if (!payload.authorName && req.user.name) {
    payload.authorName = req.user.name
  }
  const article = await res.app.locals.models.NewsArticle.findByPk(req.params.id)
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, "News article not found")
  }
  await article.update(payload)
  const updatedArticle = article.toJSON()
  addIdAlias(updatedArticle)
  return makeResponse(res, StatusCodes.OK, { article: updatedArticle }, "News article updated")
})

const deleteNews = asyncHandler(async (req, res) => {
  const article = await res.app.locals.models.NewsArticle.findByPk(req.params.id)
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, "News article not found")
  }
  await article.destroy()
  const deletedArticle = article.toJSON()
  addIdAlias(deletedArticle)
  return makeResponse(res, StatusCodes.OK, { article: deletedArticle }, "News article deleted")
})

// Projects
const listProjects = asyncHandler(async (req, res) => {
  const projects = await res.app.locals.models.Project.findAll({ order: [["order", "ASC"], ["created_at", "DESC"]] })
  const projectsPlain = projects.map((p) => { const obj = p.toJSON(); addIdAlias(obj); return obj })
  return makeResponse(res, StatusCodes.OK, { projects: projectsPlain })
})

const createProject = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  }
  const project = await res.app.locals.models.Project.create(payload)
  const projectJson = project.toJSON()
  addIdAlias(projectJson)
  return makeResponse(res, StatusCodes.CREATED, { project: projectJson }, "Project created")
})

const updateProject = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    updatedBy: req.user.id,
  }
  const project = await res.app.locals.models.Project.findByPk(req.params.id)
  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Project not found")
  }
  await project.update(payload)
  const updatedProject = project.toJSON()
  addIdAlias(updatedProject)
  return makeResponse(res, StatusCodes.OK, { project: updatedProject }, "Project updated")
})

const deleteProject = asyncHandler(async (req, res) => {
  const project = await res.app.locals.models.Project.findByPk(req.params.id)
  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Project not found")
  }
  await project.destroy()
  const deletedProject = project.toJSON()
  addIdAlias(deletedProject)
  return makeResponse(res, StatusCodes.OK, { project: deletedProject }, "Project deleted")
})

// Team
const listTeamMembers = asyncHandler(async (req, res) => {
  const members = await res.app.locals.models.TeamMember.findAll({ order: [["order", "ASC"], ["created_at", "DESC"]] })
  const membersPlain = members.map((m) => { const obj = m.toJSON(); addIdAlias(obj); return obj })
  return makeResponse(res, StatusCodes.OK, { members: membersPlain })
})

const createTeamMember = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  }
  const member = await res.app.locals.models.TeamMember.create(payload)
  const memberJson = member.toJSON()
  addIdAlias(memberJson)
  return makeResponse(res, StatusCodes.CREATED, { member: memberJson }, "Team member created")
})

const updateTeamMember = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    updatedBy: req.user.id,
  }
  const member = await res.app.locals.models.TeamMember.findByPk(req.params.id)
  if (!member) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Team member not found")
  }
  await member.update(payload)
  const updatedMember = member.toJSON()
  addIdAlias(updatedMember)
  return makeResponse(res, StatusCodes.OK, { member: updatedMember }, "Team member updated")
})

const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await res.app.locals.models.TeamMember.findByPk(req.params.id)
  if (!member) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Team member not found")
  }
  await member.destroy()
  const deletedMember = member.toJSON()
  addIdAlias(deletedMember)
  return makeResponse(res, StatusCodes.OK, { member: deletedMember }, "Team member deleted")
})

module.exports = {
  listServices,
  createService,
  updateService,
  deleteService,
  listNews,
  getNews,
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
}
