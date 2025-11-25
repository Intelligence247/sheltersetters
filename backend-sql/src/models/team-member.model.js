const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const TeamMember = sequelize.define(
    "TeamMember",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, allowNull: false },
      bio: { type: DataTypes.TEXT },
      imageUrl: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER, defaultValue: 0 },
      socialLinks: { type: DataTypes.JSON },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      // createdBy and updatedBy are created via associations (belongsTo Admin)
    },
    {
      tableName: "team_members",
    }
  )

  return TeamMember
}
