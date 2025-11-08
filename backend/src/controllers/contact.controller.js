const { StatusCodes } = require("http-status-codes")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")
const { submitMessage, listMessages, updateMessageStatus } = require("../services/contact.service")

const submitContactForm = asyncHandler(async (req, res) => {
  const message = await submitMessage(req.body)
  return res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, { message }, "Message received, thank you."))
})

const getMessages = asyncHandler(async (req, res) => {
  const filters = {
    status: req.query.status,
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
  }
  const result = await listMessages(filters)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, result))
})

const changeMessageStatus = asyncHandler(async (req, res) => {
  const message = await updateMessageStatus(req.params.id, req.body)
  return res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, { message }, "Message updated"))
})

module.exports = {
  submitContactForm,
  getMessages,
  changeMessageStatus,
}

