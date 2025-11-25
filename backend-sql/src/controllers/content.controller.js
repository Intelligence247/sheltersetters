const { StatusCodes } = require("http-status-codes")
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

const getHome = asyncHandler(async (req, res) => {
  const data = await getHomeContent(res.app.locals.models)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, data))
})

const getServices = asyncHandler(async (req, res) => {
  const services = await fetchServices(res.app.locals.models)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { services }))
})

const getNews = asyncHandler(async (req, res) => {
  const news = await fetchNews(res.app.locals.models)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { news }))
})

const getNewsArticle = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { Op } = require("sequelize")
  const { addIdAlias } = require("../utils/compat")
  const article = await res.app.locals.models.NewsArticle.findOne({
    where: {
      [Op.or]: [{ id }, { slug: id }],
    },
  })
  if (!article) {
    throw new ApiError(StatusCodes.NOT_FOUND, "News article not found")
  }
  const art = article.toJSON()
  addIdAlias(art)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { article: art }))
})

const getProjects = asyncHandler(async (req, res) => {
  const projects = await fetchProjects(res.app.locals.models)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { projects }))
})

const getTeam = asyncHandler(async (req, res) => {
  const team = await fetchTeam(res.app.locals.models)
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
