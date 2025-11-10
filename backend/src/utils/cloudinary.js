const { v2: cloudinary } = require("cloudinary")

const config = require("../config")

const { cloudinary: cloudinaryConfig } = config.uploads

if (!cloudinaryConfig.cloudName || !cloudinaryConfig.apiKey || !cloudinaryConfig.apiSecret) {
  // eslint-disable-next-line no-console
  console.warn("Cloudinary credentials are missing. File uploads will fail until configured.")
}

cloudinary.config({
  cloud_name: cloudinaryConfig.cloudName,
  api_key: cloudinaryConfig.apiKey,
  api_secret: cloudinaryConfig.apiSecret,
})

module.exports = cloudinary

