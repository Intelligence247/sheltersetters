const { StatusCodes } = require("http-status-codes")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")
const { listAdmins, createAdmin, updateAdminRole } = require("../services/admin-management.service")

const getAdmins = asyncHandler(async (_req, res) => {
  const admins = await listAdmins()
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { admins }))
})

const createAdminAccount = asyncHandler(async (req, res) => {
  const admin = await createAdmin(req.body)
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, { admin }, "Administrator account created"))
})

const changeAdminRole = asyncHandler(async (req, res) => {
  const admin = await updateAdminRole(req.params.id, req.body)
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, { admin }, "Administrator details updated"))
})

module.exports = {
  getAdmins,
  createAdminAccount,
  changeAdminRole,
}

