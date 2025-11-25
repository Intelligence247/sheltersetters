const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const ContactMessage = sequelize.define(
    "ContactMessage",
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
      },
      phone: {
        type: DataTypes.STRING,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reply: {
        type: DataTypes.TEXT,
      },
      repliedAt: {
        type: DataTypes.DATE,
      },
      // repliedBy is created via association (belongsTo Admin) so we don't define an attribute
      status: {
        type: DataTypes.ENUM("new", "in_progress", "closed"),
        defaultValue: "new",
      },
      respondedAt: {
        type: DataTypes.DATE,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "contact_messages",
    }
  )

  return ContactMessage
}
