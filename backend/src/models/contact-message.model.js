const mongoose = require("mongoose")

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    reply: {
      type: String,
      trim: true,
    },
    repliedAt: {
      type: Date,
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    status: {
      type: String,
      enum: ["new", "in_progress", "closed"],
      default: "new",
    },
    respondedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("ContactMessage", contactMessageSchema)

