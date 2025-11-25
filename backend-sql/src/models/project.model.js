const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Project = sequelize.define(
    "Project",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, allowNull: false, unique: true },
      summary: { type: DataTypes.TEXT, allowNull: false },
      description: { type: DataTypes.TEXT },
      category: { type: DataTypes.STRING },
      location: { type: DataTypes.STRING },
      imageUrl: { type: DataTypes.STRING },
      gallery: { type: DataTypes.JSON },
      metrics: { type: DataTypes.JSON },
      completedAt: { type: DataTypes.DATE },
      order: { type: DataTypes.INTEGER, defaultValue: 0 },
      isFeatured: { type: DataTypes.BOOLEAN, defaultValue: true },
      // createdBy and updatedBy are created via associations (belongsTo Admin)
    },
    {
      tableName: "projects",
    }
  )

  return Project
}
