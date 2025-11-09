const { StatusCodes } = require("http-status-codes")
const ContactMessage = require("../models/contact-message.model")
const Admin = require("../models/admin.model")
const ApiError = require("../utils/api-error")
const { sendEmail } = require("../utils/email")
const config = require("../config")

const submitMessage = async ({ name, email, phone, message }) => {
  const contactMessage = await ContactMessage.create({ name, email, phone, message })

  if (config.email.from) {
    await sendEmail({
      to: config.email.from,
      subject: "New contact form submission",
      text: `${name} (${email}${phone ? `, ${phone}` : ""}) sent a message: ${message}`,
      html: `<p><strong>${name}</strong> (${email}${phone ? `, ${phone}` : ""}) sent a message.</p><p>${message}</p>`,
    })
  }

  return contactMessage
}

const listMessages = async ({ status, page = 1, limit = 20 }) => {
  const query = {}
  if (status) {
    query.status = status
  }

  const skip = (page - 1) * limit

  const [messages, total] = await Promise.all([
    ContactMessage.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ContactMessage.countDocuments(query),
  ])

  return {
    messages,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  }
}

const updateMessageStatus = async (id, { status, notes }) => {
  const message = await ContactMessage.findById(id)
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
  return message
}

const replyToMessage = async (id, adminId, { reply, status }) => {
  const message = await ContactMessage.findById(id)
  if (!message) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Message not found")
  }

  const admin = await Admin.findById(adminId)
  if (!admin) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Admin not found")
  }

  const responseTime = new Date()
  message.reply = reply
  message.repliedAt = responseTime
  message.repliedBy = admin._id
  message.respondedAt = responseTime
  if (status) {
    message.status = status
  } else {
    message.status = "closed"
  }
  await message.save()

  await sendEmail({
    to: message.email,
    subject: "Re: Your message to Shelter Setters",
    text: reply,
    html: `<p>${reply.replace(/\n/g, "<br/>")}</p>`,
  })

  return message
}

module.exports = {
  submitMessage,
  listMessages,
  updateMessageStatus,
  replyToMessage,
}

