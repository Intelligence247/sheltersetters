const request = require('supertest')
const { setupApp, teardown } = require('./helpers')

describe('Content endpoints', () => {
  let app
  let models
  let createdNews
  beforeAll(async () => {
    const setup = await setupApp()
    app = setup.app
    models = setup.models
    createdNews = await models.NewsArticle.create({
      headline: 'Integration Test Article',
      slug: 'integration-article',
      summary: 'Article summary',
      body: 'Full body of the article for integration testing.',
    })
  })

  afterAll(async () => {
    await teardown()
  })

  test('GET /api/content/home returns default structured content', async () => {
    const res = await request(app).get('/api/content/home')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toHaveProperty('services')
    expect(Array.isArray(res.body.data.services)).toBe(true)
    expect(res.body.data).toHaveProperty('news')
    expect(Array.isArray(res.body.data.news)).toBe(true)
  })

  test('GET /api/content/services returns array', async () => {
    const res = await request(app).get('/api/content/services')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.data.services)).toBe(true)
  })

  test('GET /api/content/news returns array', async () => {
    const res = await request(app).get('/api/content/news')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.data.news)).toBe(true)
  })

  test('GET /api/content/news/:id can fetch created article', async () => {
    const res = await request(app).get(`/api/content/news/${createdNews.id}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.data.article._id).toBe(createdNews.id)
  })

  test('GET /api/content/projects returns array', async () => {
    const res = await request(app).get('/api/content/projects')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.data.projects)).toBe(true)
  })

  test('GET /api/content/team returns array', async () => {
    const res = await request(app).get('/api/content/team')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.data.team)).toBe(true)
  })
})
