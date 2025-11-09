const crypto = require("crypto")
const { StatusCodes } = require("http-status-codes")
const Admin = require("../models/admin.model")
const ApiError = require("../utils/api-error")
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt")
const config = require("../config")
const { sendEmail } = require("../utils/email")

const sanitizeAdmin = (admin) => {
  const adminObj = admin.toObject()
  delete adminObj.password
  delete adminObj.refreshTokenVersion
  delete adminObj.resetPasswordToken
  delete adminObj.resetPasswordExpires
  return adminObj
}

const generateAuthTokens = (admin) => {
  const payload = { id: admin._id.toString(), role: admin.role, version: admin.refreshTokenVersion }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  return { accessToken, refreshToken, token: accessToken }
}

const buildAuthResponse = (admin) => {
  return {
    ...generateAuthTokens(admin),
    admin: sanitizeAdmin(admin),
  }
}

const registerAdmin = async ({ name, email, password, role = "admin", registrationSecret }) => {
  if (config.admin.registrationSecret && registrationSecret !== config.admin.registrationSecret) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Invalid registration secret")
  }

  const existing = await Admin.findOne({ email })
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "An admin with that email already exists")
  }

  const admin = await Admin.create({ name, email, password, role })
  return buildAuthResponse(admin)
}

const loginAdmin = async ({ email, password }) => {
  const admin = await Admin.findOne({ email }).select("+password")
  if (!admin) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials")
  }

  const isMatch = await admin.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials")
  }

  admin.lastLoginAt = new Date()
  await admin.save()

  return buildAuthResponse(admin)
}

const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token missing")
  }

  let decoded
  try {
    decoded = verifyRefreshToken(refreshToken)
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token")
  }

  const admin = await Admin.findById(decoded.id)
  if (!admin || !admin.isActive) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Admin not found or inactive")
  }

  if (decoded.version !== admin.refreshTokenVersion) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token revoked")
  }

  return buildAuthResponse(admin)
}

const logoutAdmin = async (adminId) => {
  const admin = await Admin.findById(adminId)
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found")
  }
  admin.refreshTokenVersion += 1
  await admin.save()
  return true
}

const getAdminProfile = async (adminId) => {
  const admin = await Admin.findById(adminId)
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found")
  }
  return sanitizeAdmin(admin)
}

const forgotPassword = async (email, originUrl) => {
  const admin = await Admin.findOne({ email })

  if (!admin) {
    // respond success regardless to prevent user enumeration
    return null
  }

  const resetToken = crypto.randomBytes(32).toString("hex")
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  const expiresAt = new Date(Date.now() + config.auth.passwordResetTokenExpiryMinutes * 60 * 1000)

  admin.resetPasswordToken = hashedToken
  admin.resetPasswordExpires = expiresAt
  await admin.save()

  const resetUrl = `${originUrl || config.publicUrls.backend}/auth/reset-password?token=${resetToken}`
  const text = `You requested a password reset for your Shelter Setters admin account. Use the token below or visit the link to reset your password.\n\nToken: ${resetToken}\nLink: ${resetUrl}\n\nIf you did not request this, please ignore this email.`
  const html = `<p>You requested a password reset for your Shelter Setters admin account.</p><p><strong>Token:</strong> ${resetToken}</p><p>Or reset using this link:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can safely ignore this email.</p>`

  await sendEmail({
    to: admin.email,
    subject: "Shelter Setters Admin Password Reset",
    text,
    html,
  })

  return true
}

const resetPassword = async ({ token, password }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  const admin = await Admin.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+password")

  if (!admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired reset token")
  }

  admin.password = password
  admin.resetPasswordToken = undefined
  admin.resetPasswordExpires = undefined
  admin.refreshTokenVersion += 1
  await admin.save()

  return buildAuthResponse(admin)
}

module.exports = {
  registerAdmin,
  loginAdmin,
  refreshSession,
  logoutAdmin,
  getAdminProfile,
  forgotPassword,
  resetPassword,
}

