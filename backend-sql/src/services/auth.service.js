const crypto = require("crypto")
const { StatusCodes } = require("http-status-codes")
const ApiError = require("../utils/api-error")
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/jwt")
const config = require("../config")
const { sendEmail } = require("../utils/email")

const sanitizeAdmin = (admin) => {
  const adminObj = admin.toJSON ? admin.toJSON() : admin
  delete adminObj.password
  delete adminObj.refreshTokenVersion
  delete adminObj.resetPasswordToken
  delete adminObj.resetPasswordExpires
  return adminObj
}

const addIdAlias = (obj) => {
  if (obj && !obj._id && obj.id) obj._id = obj.id
  return obj
}

const generateAuthTokens = (admin) => {
  const payload = { id: admin.id, role: admin.role, version: admin.refreshTokenVersion }
  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)
  return { accessToken, refreshToken, token: accessToken }
}

const buildAuthResponse = (admin) => {
  const adminObj = sanitizeAdmin(admin)
  if (adminObj && !adminObj._id && adminObj.id) adminObj._id = adminObj.id
  return {
    ...generateAuthTokens(admin),
    admin: adminObj,
  }
}

const registerAdmin = async (models, { name, email, password, registrationSecret }) => {
  if (!config.admin.registrationSecret) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      "Admin self-registration is disabled. Contact a system administrator."
    )
  }

  if (registrationSecret !== config.admin.registrationSecret) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Invalid registration secret")
  }

  const existing = await models.Admin.findOne({ where: { email }, attributes: { include: ["password"] } })
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "An admin with that email already exists")
  }

  const admin = await models.Admin.create({ name, email, password, role: "super_admin" })
  return buildAuthResponse(admin)
}

const loginAdmin = async (models, { email, password }) => {
  const admin = await models.Admin.findOne({ where: { email }, attributes: { include: ["password"] } })
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

const refreshSession = async (models, refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token missing")
  }

  let decoded
  try {
    decoded = verifyRefreshToken(refreshToken)
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token")
  }

  const admin = await models.Admin.findByPk(decoded.id)
  if (!admin || !admin.isActive) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Admin not found or inactive")
  }

  if (decoded.version !== admin.refreshTokenVersion) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token revoked")
  }

  return buildAuthResponse(admin)
}

const logoutAdmin = async (models, adminId) => {
  const admin = await models.Admin.findByPk(adminId)
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found")
  }
  admin.refreshTokenVersion += 1
  await admin.save()
  return true
}

const getAdminProfile = async (models, adminId) => {
  const admin = await models.Admin.findByPk(adminId)
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found")
  }
  return addIdAlias(sanitizeAdmin(admin))
}

const forgotPassword = async (models, email, originUrl) => {
  const admin = await models.Admin.findOne({ where: { email }, attributes: { include: ["password"] } })

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

const resetPassword = async (models, { token, password }) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

  const admin = await models.Admin.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        [models.Admin.sequelize.Sequelize.Op.gt]: new Date(),
      },
    },
  })

  if (!admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired reset token")
  }

  admin.password = password
  admin.resetPasswordToken = null
  admin.resetPasswordExpires = null
  admin.refreshTokenVersion += 1
  await admin.save()

  return { ...buildAuthResponse(admin), admin: addIdAlias(sanitizeAdmin(admin)) }
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
