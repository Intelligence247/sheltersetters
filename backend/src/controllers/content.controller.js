const { StatusCodes } = require("http-status-codes")
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
  getProjects,
  getTeam,
}

