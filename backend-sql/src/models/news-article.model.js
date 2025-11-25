const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const NewsArticle = sequelize.define(
    "NewsArticle",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      headline: { type: DataTypes.STRING, allowNull: false },
      slug: { type: DataTypes.STRING, unique: true },
      summary: { type: DataTypes.TEXT, allowNull: false },
      body: { type: DataTypes.TEXT },
      imageUrl: { type: DataTypes.STRING },
      altText: { type: DataTypes.STRING },
      gallery: { type: DataTypes.JSON },
      authorName: { type: DataTypes.STRING },
      readingTime: { type: DataTypes.INTEGER, defaultValue: 1 },
      publishedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
      // createdBy and updatedBy are created via associations (belongsTo Admin)
      tags: { type: DataTypes.JSON },
    },
    {
      tableName: "news_articles",
    }
  )

  // generate slug and readingTime hooks similar to mongoose pre-save
  NewsArticle.addHook("beforeSave", (article) => {
    if (article.changed("headline") && !article.slug) {
      article.slug = article.headline
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    if (article.changed("body") && article.body) {
      const wordCount = article.body.trim().split(/\s+/).length
      article.readingTime = Math.max(1, Math.ceil(wordCount / 200))
    } else if (!article.readingTime) {
      article.readingTime = 1
    }
  })

  return NewsArticle
}
