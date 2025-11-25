const { StatusCodes } = require("http-status-codes")
const { promises: fs } = require("fs")
const path = require("path")
const { v4: uuidv4 } = require("uuid")

const config = require("../config")
const ApiError = require("../utils/api-error")
const ApiResponse = require("../utils/api-response")
const asyncHandler = require("../utils/async-handler")

const sanitizeFolder = (folder) => {
  if (!folder) return ""
  const normalized = folder.replace(/[^a-zA-Z0-9/_-]/g, "")
  return normalized.replace(/\/+/g, "/")
}

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No file uploaded")
  }

  const { size, originalname, mimetype, buffer } = req.file

  const maxBytes = config.uploads.maxFileSizeMb * 1024 * 1024
  if (size > maxBytes) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `File exceeds maximum size of ${config.uploads.maxFileSizeMb}MB`)
  }

  const extension = (originalname.split(".").pop() || "").toLowerCase()
  const allowedFormats = config.uploads.allowedFormats.length
    ? config.uploads.allowedFormats.map((format) => format.toLowerCase())
    : null

  if (allowedFormats && extension && !allowedFormats.includes(extension)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Unsupported file format. Allowed: ${allowedFormats.join(", ")}`)
  }

  if (!mimetype.startsWith("image/")) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Only image uploads are supported")
  }

  try {
    const folderPart = sanitizeFolder(req.body.folder || "")
    const baseDir = path.resolve(process.cwd(), config.uploads.dir || "public/uploads")
    const destDir = folderPart ? path.join(baseDir, folderPart) : baseDir

    await fs.mkdir(destDir, { recursive: true })

    const filename = `${Date.now()}-${uuidv4()}.${extension}`
    const filepath = path.join(destDir, filename)
    await fs.writeFile(filepath, buffer)

    const publicPath = folderPart ? `${folderPart.replace(/\\/g, "/")}/${filename}` : filename
    const url = `${config.publicUrls.backend.replace(/\/$/, "")}/uploads/${publicPath}`

    return res.status(StatusCodes.CREATED).json(
      new ApiResponse(StatusCodes.CREATED, {
        url,
        publicId: publicPath,
        bytes: size,
        format: extension,
      })
    )
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to upload image", error instanceof Error ? [error.message] : [])
  }
})

module.exports = {
  uploadImage,
}
