const ContactMessage = require("../models/contact-message.model")
const Project = require("../models/project.model")
const TeamMember = require("../models/team-member.model")
const NewsArticle = require("../models/news-article.model")
const Service = require("../models/service.model")

const getDashboardOverview = async () => {
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
    ContactMessage.countDocuments({ status: { $ne: "closed" } }),
    ContactMessage.countDocuments(),
    TeamMember.countDocuments({ isActive: true }),
    TeamMember.countDocuments(),
    Project.countDocuments({ isFeatured: true }),
    Project.countDocuments(),
    Service.countDocuments({ isActive: true }),
    Service.countDocuments(),
    NewsArticle.countDocuments(),
    ContactMessage.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email status createdAt message"),
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
    recentMessages,
  }
}

module.exports = {
  getDashboardOverview,
}

