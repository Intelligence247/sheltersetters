const multer = require("multer")
const { StatusCodes } = require("http-status-codes")

const config = require("../config")
const ApiError = require("../utils/api-error")

const fileSizeLimitBytes = config.uploads.maxFileSizeMb * 1024 * 1024

const storage = multer.memoryStorage()

const imageFileFilter = (_req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new ApiError(StatusCodes.BAD_REQUEST, "Only image uploads are supported"))
    return
  }
  cb(null, true)
}

const upload = multer({
  storage,
  limits: { fileSize: fileSizeLimitBytes },
  fileFilter: imageFileFilter,
})

const uploadImage = (req, res, next) => {
  upload.single("file")(req, res, (error) => {
    if (error) {
      if (error.code === "LIMIT_FILE_SIZE") {
        return next(
          new ApiError(
            StatusCodes.BAD_REQUEST,
            `File exceeds maximum size of ${config.uploads.maxFileSizeMb}MB`
          )
        )
      }
      return next(new ApiError(StatusCodes.BAD_REQUEST, error.message))
    }
    return next()
  })
}

module.exports = {
  uploadImage,
}

