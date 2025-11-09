const { StatusCodes } = require("http-status-codes")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")
const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  refreshSession,
  logoutAdmin,
  forgotPassword,
  resetPassword,
} = require("../services/auth.service")

const register = asyncHandler(async (req, res) => {
  const result = await registerAdmin(req.body)
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, result, "Admin registered successfully"))
})

const login = asyncHandler(async (req, res) => {
  const result = await loginAdmin(req.body)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result, "Login successful"))
})

const me = asyncHandler(async (req, res) => {
  const profile = await getAdminProfile(req.user._id)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { admin: profile }))
})

const refresh = asyncHandler(async (req, res) => {
  const result = await refreshSession(req.body.refreshToken)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result, "Session refreshed"))
})

const logout = asyncHandler(async (req, res) => {
  await logoutAdmin(req.user._id)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { success: true }, "Logged out"))
})

const forgot = asyncHandler(async (req, res) => {
  await forgotPassword(req.body.email, req.body.baseUrl)
  return res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, { success: true }, "If the email exists, a reset link has been sent"))
})

const reset = asyncHandler(async (req, res) => {
  const result = await resetPassword(req.body)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result, "Password reset successful"))
})

module.exports = {
  register,
  login,
  me,
  refresh,
  logout,
  forgot,
  reset,
}

