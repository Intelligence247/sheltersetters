const mongoose = require("mongoose")

const newsArticleSchema = new mongoose.Schema(
  {
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
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
    gallery: [
      {
        url: {
          type: String,
          trim: true,
        },
        alt: {
          type: String,
          trim: true,
        },
      },
    ],
    authorName: {
      type: String,
      trim: true,
    },
    readingTime: {
      type: Number,
      min: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
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

// Generate slug from headline before saving
newsArticleSchema.pre("save", function (next) {
  if (this.isModified("headline") && !this.slug) {
    this.slug = this.headline
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }
  // Calculate reading time (average 200 words per minute)
  if (this.isModified("body") && this.body) {
    const wordCount = this.body.trim().split(/\s+/).length
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200))
  } else if (!this.readingTime) {
    this.readingTime = 1
  }
  next()
})

module.exports = mongoose.model("NewsArticle", newsArticleSchema)

