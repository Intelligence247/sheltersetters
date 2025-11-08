const mongoose = require("mongoose")

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    socialLinks: [
      {
        platform: { type: String, trim: true },
        url: { type: String, trim: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("TeamMember", teamMemberSchema)

