const { StatusCodes } = require("http-status-codes")
const Admin = require("../models/admin.model")
const ApiError = require("../utils/api-error")

const sanitizeAdmin = (admin) => {
  const adminObj = admin.toObject()
  delete adminObj.password
  delete adminObj.resetPasswordToken
  delete adminObj.resetPasswordExpires
  delete adminObj.refreshTokenVersion
  return adminObj
}

const listAdmins = async () => {
  const admins = await Admin.find().sort({ createdAt: -1 })
  return admins.map(sanitizeAdmin)
}

const createAdmin = async ({ name, email, password, role }) => {
  const existing = await Admin.findOne({ email })
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "An admin with that email already exists")
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role,
  })

  return sanitizeAdmin(admin)
}

const updateAdminRole = async (adminId, { role, isActive }) => {
  const admin = await Admin.findById(adminId)
  if (!admin) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found")
  }

  if (role) {
    admin.role = role
  }

  if (typeof isActive === "boolean") {
    admin.isActive = isActive
  }

  await admin.save()
  return sanitizeAdmin(admin)
}

module.exports = {
  listAdmins,
  createAdmin,
  updateAdminRole,
}

