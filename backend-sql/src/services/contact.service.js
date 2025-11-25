const { StatusCodes } = require("http-status-codes")
const ApiError = require("../utils/api-error")
const { sendEmail } = require("../utils/email")
const config = require("../config")
const { Op } = require("sequelize")
const { log, error: logError } = require("../utils/logger")
const { normalizeForFrontend } = require("../utils/compat")

const submitMessage = async (models, { name, email, phone, message }) => {
  const contactMessage = await models.ContactMessage.create({ name, email, phone, message })

  // Send email in background (non-blocking) so UI responds immediately
  if (config.email.from) {
    sendEmail({
      to: config.email.from,
      subject: "New contact form submission",
      text: `${name} (${email}${phone ? `, ${phone}` : ""}) sent a message: ${message}`,
      html: `<p><strong>${name}</strong> (${email}${phone ? `, ${phone}` : ""}) sent a message.</p><p>${message}</p>`,
    })
      .then(() => {
        log("Contact notification email sent successfully")
      })
      .catch((err) => {
        logError("Failed to send contact notification email (non-blocking):", err.message)
      })
  }

  const result = contactMessage.toJSON()
  // Return immediately - email is sent in background
  return { message: normalizeForFrontend(result) }
}

const listMessages = async (models, { status, page = 1, limit = 20 }) => {
  const query = {}
  if (status) {
    query.status = status
  }

  const skip = (page - 1) * limit

  const [messages, total] = await Promise.all([
    models.ContactMessage.findAll({
      where: query,
      order: [["created_at", "DESC"]],
      offset: skip,
      limit,
    }),
    models.ContactMessage.count({ where: query }),
  ])

  return {
    messages: messages.map((m) => {
      const obj = m.toJSON()
      return normalizeForFrontend(obj)
    }),
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  }
}

const updateMessageStatus = async (models, id, { status, notes }) => {
  const message = await models.ContactMessage.findByPk(id)
  if (!message) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Message not found")
  }

  if (status) {
    message.status = status
    if (status === "closed") {
      message.respondedAt = new Date()
    }
  }

  if (notes !== undefined) {
    message.notes = notes
  }

  await message.save()
  const updated = message.toJSON()
  return normalizeForFrontend(updated)
}

const replyToMessage = async (models, id, adminId, { reply, status }) => {
  const message = await models.ContactMessage.findByPk(id)
  if (!message) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Message not found")
  }

  const admin = await models.Admin.findByPk(adminId)
  if (!admin) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Admin not found")
  }

  const responseTime = new Date()
  message.reply = reply
  message.repliedAt = responseTime
  message.repliedBy = admin.id
  message.respondedAt = responseTime
  if (status) {
    message.status = status
  } else {
    message.status = "closed"
  }
  await message.save()

  // Send reply email in background (non-blocking)
  if (config.email.from || message.email) {
    sendEmail({
      to: message.email,
      subject: "Re: Your message to Shelter Setters",
      text: reply,
      html: `<p>${reply.replace(/\n/g, "<br/>")}</p>`,
    })
      .then(() => {
        log(`Reply email sent successfully to ${message.email}`)
      })
      .catch((err) => {
        logError("Failed to send reply email (non-blocking):", err.message)
      })
  }

  const replied = message.toJSON()
  // Return immediately - email is sent in background
  return { message: normalizeForFrontend(replied) }
}

module.exports = {
  submitMessage,
  listMessages,
  updateMessageStatus,
  replyToMessage,
}
