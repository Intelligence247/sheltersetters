const { StatusCodes } = require("http-status-codes")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")
const { listAdmins, createAdmin, updateAdminRole } = require("../services/admin-management.service")

const getAdmins = asyncHandler(async (req, res) => {
  const admins = await listAdmins(res.app.locals.models)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { admins }))
})

const createAdminAccount = asyncHandler(async (req, res) => {
  const admin = await createAdmin(res.app.locals.models, req.body)
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, { admin }, "Administrator account created"))
})

const changeAdminRole = asyncHandler(async (req, res) => {
  const admin = await updateAdminRole(res.app.locals.models, req.params.id, req.body)
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, { admin }, "Administrator details updated"))
})

module.exports = {
  getAdmins,
  createAdminAccount,
  changeAdminRole,
}
