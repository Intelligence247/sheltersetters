const { StatusCodes } = require("http-status-codes")
const Admin = require("../models/admin.model")
const ApiError = require("../utils/api-error")
const { signToken } = require("../utils/jwt")
const config = require("../config")

const sanitizeAdmin = (admin) => {
  const adminObj = admin.toObject()
  delete adminObj.password
  return adminObj
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
  return sanitizeAdmin(admin)
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

  const token = signToken({ id: admin._id, role: admin.role })
  return {
    token,
    admin: sanitizeAdmin(admin),
  }
}

const getAdminProfile = async (adminId) => {
  const admin = await Admin.findById(adminId)
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found")
  }
  return sanitizeAdmin(admin)
}

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
}

