const { StatusCodes } = require("http-status-codes")
const NewsArticle = require("../models/news-article.model")
const ApiError = require("../utils/api-error")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")
const {
  getHomeContent,
  fetchServices,
  fetchNews,
  fetchProjects,
  fetchTeam,
} = require("../services/content.service")

const getHome = asyncHandler(async (_req, res) => {
  const data = await getHomeContent()
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, data))
})

const getServices = asyncHandler(async (_req, res) => {
  const services = await fetchServices()
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { services }))
})

const getNews = asyncHandler(async (_req, res) => {
  const news = await fetchNews()
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { news }))
})

const getNewsArticle = asyncHandler(async (req, res) => {
  const { id } = req.params
  const article = await NewsArticle.findOne({
    $or: [{ _id: id }, { slug: id }],
  })
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, "News article not found")
  }
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { article }))
})

const getProjects = asyncHandler(async (_req, res) => {
  const projects = await fetchProjects()
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { projects }))
})

const getTeam = asyncHandler(async (_req, res) => {
  const team = await fetchTeam()
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { team }))
})

module.exports = {
  getHome,
  getServices,
  getNews,
  getNewsArticle,
  getProjects,
  getTeam,
}

