const { connectDatabase, disconnectDatabase } = require('./config/database')
const {
  defaultServices,
  defaultNews,
  defaultProjects,
  defaultTeamMembers,
} = require('./constants/default-content')

const run = async () => {
  const { sequelize, models } = await connectDatabase()
  try {
    const countServices = await models.Service.count()
    if (countServices === 0) {
      console.log('Seeding default services...')
      await models.Service.bulkCreate(defaultServices)
    }

    const countNews = await models.NewsArticle.count()
    if (countNews === 0) {
      console.log('Seeding default news...')
      await models.NewsArticle.bulkCreate(defaultNews)
    }

    const countProjects = await models.Project.count()
    if (countProjects === 0) {
      console.log('Seeding default projects...')
      await models.Project.bulkCreate(defaultProjects)
    }

    const countTeam = await models.TeamMember.count()
    if (countTeam === 0) {
      console.log('Seeding default team members...')
      await models.TeamMember.bulkCreate(defaultTeamMembers)
    }

    console.log('Seeding complete.')
  } catch (err) {
    console.error('Seeder failed:', err)
  } finally {
    await disconnectDatabase()
    process.exit(0)
  }
}

run()
