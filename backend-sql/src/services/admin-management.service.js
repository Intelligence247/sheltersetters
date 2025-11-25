const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcryptjs")
const ApiError = require("../utils/api-error")

const sanitizeAdmin = (admin) => {
  const adminObj = admin.toJSON ? admin.toJSON() : admin
  delete adminObj.password
  delete adminObj.resetPasswordToken
  delete adminObj.resetPasswordExpires
  delete adminObj.refreshTokenVersion
  return adminObj
}
// Ensure _id exists for compatibility with frontend
const addIdAlias = (obj) => {
  if (obj && !obj._id && obj.id) obj._id = obj.id
  return obj
}

const listAdmins = async (models) => {
  const admins = await models.Admin.findAll({
    order: [["created_at", "DESC"]],
    attributes: { exclude: ["password"] },
  })
  return admins.map((a) => addIdAlias(sanitizeAdmin(a)))
}

const createAdmin = async (models, { name, email, password, role }) => {
  const existing = await models.Admin.findOne({ where: { email } })
  if (existing) {
    throw new ApiError(StatusCodes.CONFLICT, "An admin with that email already exists")
  }

  const admin = await models.Admin.create({
    name,
    email,
    password,
    role,
  })

  return addIdAlias(sanitizeAdmin(admin))
}

const updateAdminRole = async (models, adminId, { role, isActive }) => {
  const admin = await models.Admin.findByPk(adminId)
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
  return addIdAlias(sanitizeAdmin(admin))
}

module.exports = {
  listAdmins,
  createAdmin,
  updateAdminRole,
}
