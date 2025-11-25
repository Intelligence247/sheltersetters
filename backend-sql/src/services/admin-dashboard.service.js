const { Op } = require("sequelize")

const getDashboardOverview = async (models) => {
  const [
    openEnquiries,
    totalEnquiries,
    activeTeam,
    totalTeam,
    liveProjects,
    totalProjects,
    activeServices,
    totalServices,
    publishedNews,
    recentMessages,
  ] = await Promise.all([
    models.ContactMessage.count({ where: { status: { [Op.ne]: "closed" } } }),
    models.ContactMessage.count(),
    models.TeamMember.count({ where: { isActive: true } }),
    models.TeamMember.count(),
    models.Project.count({ where: { isFeatured: true } }),
    models.Project.count(),
    models.Service.count({ where: { isActive: true } }),
    models.Service.count(),
    models.NewsArticle.count(),
    models.ContactMessage.findAll({
      order: [["created_at", "DESC"]],
      limit: 5,
      attributes: ["name", "email", "status", ["created_at", "createdAt"], "message"],
    }),
  ])

  return {
    metrics: {
      enquiries: {
        open: openEnquiries,
        total: totalEnquiries,
      },
      team: {
        active: activeTeam,
        total: totalTeam,
      },
      projects: {
        live: liveProjects,
        total: totalProjects,
      },
      services: {
        active: activeServices,
        total: totalServices,
      },
      news: {
        published: publishedNews,
      },
    },
    recentMessages: recentMessages.map((m) => m.toJSON()),
  }
}

module.exports = {
  getDashboardOverview,
}
