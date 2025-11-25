const { StatusCodes } = require("http-status-codes")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")
const { getDashboardOverview } = require("../services/admin-dashboard.service")

const getOverview = asyncHandler(async (req, res) => {
  const overview = await getDashboardOverview(res.app.locals.models)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, overview))
})

module.exports = {
  getOverview,
}
