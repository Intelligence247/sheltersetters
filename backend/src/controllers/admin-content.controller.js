const { StatusCodes } = require("http-status-codes")
const Service = require("../models/service.model")
const NewsArticle = require("../models/news-article.model")
const Project = require("../models/project.model")
const TeamMember = require("../models/team-member.model")
const ApiError = require("../utils/api-error")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")

const makeResponse = (res, status, data, message = "Success") => res.status(status).json(new ApiResponse(status, data, message))

// Services
const listServices = asyncHandler(async (_req, res) => {
  const services = await Service.find().sort({ order: 1, createdAt: -1 })
  return makeResponse(res, StatusCodes.OK, { services })
})

const createService = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  }
  const service = await Service.create(payload)
  return makeResponse(res, StatusCodes.CREATED, { service }, "Service created")
})

const updateService = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    updatedBy: req.user._id,
  }
  const service = await Service.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found")
  }
  return makeResponse(res, StatusCodes.OK, { service }, "Service updated")
})

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id)
  if (!service) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Service not found")
  }
  return makeResponse(res, StatusCodes.OK, { service }, "Service deleted")
})

// News
const listNews = asyncHandler(async (_req, res) => {
  const news = await NewsArticle.find().sort({ publishedAt: -1 })
  return makeResponse(res, StatusCodes.OK, { news })
})

const getNews = asyncHandler(async (req, res) => {
  const { id } = req.params
  const article = await NewsArticle.findOne({
    $or: [{ _id: id }, { slug: id }],
  })
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, "News article not found")
  }
  return makeResponse(res, StatusCodes.OK, { article })
})

const createNews = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  }
  // If authorName is not provided, try to get it from the user
  if (!payload.authorName && req.user.name) {
    payload.authorName = req.user.name
  }
  const article = await NewsArticle.create(payload)
  return makeResponse(res, StatusCodes.CREATED, { article }, "News article created")
})

const updateNews = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    updatedBy: req.user._id,
  }
  // If authorName is not provided, try to get it from the user
  if (!payload.authorName && req.user.name) {
    payload.authorName = req.user.name
  }
  const article = await NewsArticle.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, "News article not found")
  }
  return makeResponse(res, StatusCodes.OK, { article }, "News article updated")
})

const deleteNews = asyncHandler(async (req, res) => {
  const article = await NewsArticle.findByIdAndDelete(req.params.id)
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, "News article not found")
  }
  return makeResponse(res, StatusCodes.OK, { article }, "News article deleted")
})

// Projects
const listProjects = asyncHandler(async (_req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 })
  return makeResponse(res, StatusCodes.OK, { projects })
})

const createProject = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  }
  const project = await Project.create(payload)
  return makeResponse(res, StatusCodes.CREATED, { project }, "Project created")
})

const updateProject = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    updatedBy: req.user._id,
  }
  const project = await Project.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Project not found")
  }
  return makeResponse(res, StatusCodes.OK, { project }, "Project updated")
})

const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id)
  if (!project) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Project not found")
  }
  return makeResponse(res, StatusCodes.OK, { project }, "Project deleted")
})

// Team
const listTeamMembers = asyncHandler(async (_req, res) => {
  const members = await TeamMember.find().sort({ order: 1, createdAt: -1 })
  return makeResponse(res, StatusCodes.OK, { members })
})

const createTeamMember = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  }
  const member = await TeamMember.create(payload)
  return makeResponse(res, StatusCodes.CREATED, { member }, "Team member created")
})

const updateTeamMember = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    updatedBy: req.user._id,
  }
  const member = await TeamMember.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true })
  if (!member) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Team member not found")
  }
  return makeResponse(res, StatusCodes.OK, { member }, "Team member updated")
})

const deleteTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.findByIdAndDelete(req.params.id)
  if (!member) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Team member not found")
  }
  return makeResponse(res, StatusCodes.OK, { member }, "Team member deleted")
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

