const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Service = sequelize.define(
    "Service",
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
      icon: { type: DataTypes.STRING },
      imageUrl: { type: DataTypes.STRING },
      order: { type: DataTypes.INTEGER, defaultValue: 0 },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
      ctaLabel: { type: DataTypes.STRING },
      ctaUrl: { type: DataTypes.STRING },
      // createdBy and updatedBy are created via associations (belongsTo Admin)
    },
    {
      tableName: "services",
    }
  )

  return Service
}
