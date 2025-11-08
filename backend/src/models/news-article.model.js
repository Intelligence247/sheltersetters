const mongoose = require("mongoose")

const newsArticleSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    altText: {
      type: String,
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("NewsArticle", newsArticleSchema)

