const { StatusCodes } = require("http-status-codes")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")
const { registerAdmin, loginAdmin, getAdminProfile } = require("../services/auth.service")

const register = asyncHandler(async (req, res) => {
  const admin = await registerAdmin(req.body)
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, { admin }, "Admin registered successfully"))
})

const login = asyncHandler(async (req, res) => {
  const result = await loginAdmin(req.body)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result, "Login successful"))
})

const me = asyncHandler(async (req, res) => {
  const profile = await getAdminProfile(req.user._id)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { admin: profile }))
})

module.exports = {
  register,
  login,
  me,
}

