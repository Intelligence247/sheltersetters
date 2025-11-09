const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
    refreshTokenVersion: {
      type: Number,
      default: 0,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

adminSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    return next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  return next()
})

adminSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

adminSchema.methods.incrementRefreshTokenVersion = async function incrementRefreshTokenVersion() {
  this.refreshTokenVersion += 1
  await this.save()
  return this.refreshTokenVersion
}

module.exports = mongoose.model("Admin", adminSchema)

