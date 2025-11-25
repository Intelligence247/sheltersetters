module.exports = (sequelize) => {
  const Admin = require("./admin.model")(sequelize)
  const ContactMessage = require("./contact-message.model")(sequelize)
  const NewsArticle = require("./news-article.model")(sequelize)
  const Project = require("./project.model")(sequelize)
  const Service = require("./service.model")(sequelize)
  const TeamMember = require("./team-member.model")(sequelize)

  // Associations
  // Disable automatic index creation to avoid MySQL 64 key limit
  ContactMessage.belongsTo(Admin, { as: "repliedBy", foreignKey: "replied_by", indexes: false })

  NewsArticle.belongsTo(Admin, { as: "createdBy", foreignKey: "created_by", indexes: false })
  NewsArticle.belongsTo(Admin, { as: "updatedBy", foreignKey: "updated_by", indexes: false })

  Project.belongsTo(Admin, { as: "createdBy", foreignKey: "created_by", indexes: false })
  Project.belongsTo(Admin, { as: "updatedBy", foreignKey: "updated_by", indexes: false })

  Service.belongsTo(Admin, { as: "createdBy", foreignKey: "created_by", indexes: false })
  Service.belongsTo(Admin, { as: "updatedBy", foreignKey: "updated_by", indexes: false })

  TeamMember.belongsTo(Admin, { as: "createdBy", foreignKey: "created_by", indexes: false })
  TeamMember.belongsTo(Admin, { as: "updatedBy", foreignKey: "updated_by", indexes: false })

  return {
    Admin,
    ContactMessage,
    NewsArticle,
    Project,
    Service,
    TeamMember,
  }
}
