const { StatusCodes } = require("http-status-codes")
const streamifier = require("streamifier")

const config = require("../config")
const ApiError = require("../utils/api-error")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")
const cloudinary = require("../utils/cloudinary")

const uploadFromBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })

    streamifier.createReadStream(buffer).pipe(stream)
  })

const sanitizeFolder = (folder) => {
  if (!folder) return config.uploads.cloudinary.folder
  const normalized = folder.replace(/[^a-zA-Z0-9/_-]/g, "")
  const base = config.uploads.cloudinary.folder ? `${config.uploads.cloudinary.folder}/${normalized}` : normalized
  return base.replace(/\/+/g, "/")
}

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded")
  }

  const {
    size,
    originalname,
    mimetype,
    buffer,
  } = req.file

  const maxBytes = config.uploads.maxFileSizeMb * 1024 * 1024
  if (size > maxBytes) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `File exceeds maximum size of ${config.uploads.maxFileSizeMb}MB`
    )
  }

  const extension = (originalname.split(".").pop() || "").toLowerCase()
  const allowedFormats = config.uploads.allowedFormats.length
    ? config.uploads.allowedFormats.map((format) => format.toLowerCase())
    : null

  if (allowedFormats && extension && !allowedFormats.includes(extension)) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `Unsupported file format. Allowed: ${allowedFormats.join(", ")}`
    )
  }

  if (!mimetype.startsWith("image/")) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Only image uploads are supported")
  }

  try {
    const uploadOptions = {
      folder: sanitizeFolder(req.body.folder),
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      resource_type: "image",
    }

    const result = await uploadFromBuffer(buffer, uploadOptions)

    return res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(StatusCodes.CREATED, {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        })
      )
  } catch (error) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to upload image",
      error instanceof Error ? [error.message] : []
    )
  }
})

module.exports = {
  uploadImage,
}

