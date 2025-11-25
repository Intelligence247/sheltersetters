const bcrypt = require("bcryptjs")
const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("super_admin", "content_manager", "customer_care"),
        defaultValue: "super_admin",
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      lastLoginAt: {
        type: DataTypes.DATE,
      },
      refreshTokenVersion: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "admins",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  )

  Admin.addHook("beforeSave", async (admin) => {
    if (admin.changed("password")) {
      const salt = await bcrypt.genSalt(10)
      admin.password = await bcrypt.hash(admin.password, salt)
    }
  })

  Admin.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
  }

  Admin.prototype.incrementRefreshTokenVersion = async function () {
    this.refreshTokenVersion += 1
    await this.save()
    return this.refreshTokenVersion
  }

  return Admin
}
