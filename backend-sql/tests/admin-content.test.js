const request = require('supertest')
const { setupApp, teardown } = require('./helpers')

describe('Admin content routes', () => {
  let app
  let authToken

  const adminPayload = {
    name: 'Content Admin',
    email: 'content-admin@local.test',
    password: 'password123',
    registrationSecret: 'test-secret',
  }

  beforeAll(async () => {
    const setup = await setupApp()
    app = setup.app

    const register = await request(app).post('/api/auth/register').send(adminPayload)
    expect(register.statusCode).toBe(201)

    const login = await request(app).post('/api/auth/login').send({
      email: adminPayload.email,
      password: adminPayload.password,
    })
    expect(login.statusCode).toBe(200)
    authToken = login.body.data.accessToken
  })

  afterAll(async () => {
    await teardown()
  })

  test('Services CRUD cycle', async () => {
    const servicePayload = {
      title: 'Test Service',
      slug: 'test-service',
      summary: 'Summary for test service',
      description: 'Detailed description',
      order: 5,
    }

    const createRes = await request(app)
      .post('/api/admin/content/services')
      .set('Authorization', `Bearer ${authToken}`)
      .send(servicePayload)
    expect(createRes.statusCode).toBe(201)
    const serviceId = createRes.body.data.service._id

    const listRes = await request(app)
      .get('/api/admin/content/services')
      .set('Authorization', `Bearer ${authToken}`)
    expect(listRes.statusCode).toBe(200)
    expect(Array.isArray(listRes.body.data.services)).toBe(true)
    expect(listRes.body.data.services.some((svc) => svc._id === serviceId)).toBe(true)

    const updateRes = await request(app)
      .patch(`/api/admin/content/services/${serviceId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ order: 10 })
    expect(updateRes.statusCode).toBe(200)
    expect(updateRes.body.data.service.order).toBe(10)

    const deleteRes = await request(app)
      .delete(`/api/admin/content/services/${serviceId}`)
      .set('Authorization', `Bearer ${authToken}`)
    expect(deleteRes.statusCode).toBe(200)
  })

  test('Projects CRUD cycle', async () => {
    const projectPayload = {
      title: 'Test Project',
      slug: 'test-project',
      summary: 'Project summary',
      description: 'Detailed project description',
      category: 'Residential',
    }

    const createRes = await request(app)
      .post('/api/admin/content/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send(projectPayload)
    expect(createRes.statusCode).toBe(201)
    const projectId = createRes.body.data.project._id

    const listRes = await request(app)
      .get('/api/admin/content/projects')
      .set('Authorization', `Bearer ${authToken}`)
    expect(listRes.statusCode).toBe(200)
    expect(listRes.body.data.projects.some((proj) => proj._id === projectId)).toBe(true)

    const updateRes = await request(app)
      .patch(`/api/admin/content/projects/${projectId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ order: 2 })
    expect(updateRes.statusCode).toBe(200)
    expect(updateRes.body.data.project.order).toBe(2)

    const deleteRes = await request(app)
      .delete(`/api/admin/content/projects/${projectId}`)
      .set('Authorization', `Bearer ${authToken}`)
    expect(deleteRes.statusCode).toBe(200)
  })

  test('Team CRUD cycle', async () => {
    const memberPayload = {
      name: 'Jane Manager',
      role: 'Operations',
      bio: 'Experienced team member',
    }

    const createRes = await request(app)
      .post('/api/admin/content/team')
      .set('Authorization', `Bearer ${authToken}`)
      .send(memberPayload)
    expect(createRes.statusCode).toBe(201)
    const memberId = createRes.body.data.member._id

    const listRes = await request(app)
      .get('/api/admin/content/team')
      .set('Authorization', `Bearer ${authToken}`)
    expect(listRes.statusCode).toBe(200)
    expect(listRes.body.data.members.some((member) => member._id === memberId)).toBe(true)

    const updateRes = await request(app)
      .patch(`/api/admin/content/team/${memberId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ order: 3 })
    expect(updateRes.statusCode).toBe(200)
    expect(updateRes.body.data.member.order).toBe(3)

    const deleteRes = await request(app)
      .delete(`/api/admin/content/team/${memberId}`)
      .set('Authorization', `Bearer ${authToken}`)
    expect(deleteRes.statusCode).toBe(200)
  })

  test('News CRUD cycle with detail fetch', async () => {
    const newsPayload = {
      headline: 'Test Headline',
      summary: 'Breaking news summary',
      body: 'Full article body',
      publishedAt: new Date().toISOString(),
    }

    const createRes = await request(app)
      .post('/api/admin/content/news')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newsPayload)
    expect(createRes.statusCode).toBe(201)
    const newsId = createRes.body.data.article._id

    const listRes = await request(app)
      .get('/api/admin/content/news')
      .set('Authorization', `Bearer ${authToken}`)
    expect(listRes.statusCode).toBe(200)
    expect(listRes.body.data.news.some((article) => article._id === newsId)).toBe(true)

    const detailRes = await request(app)
      .get(`/api/admin/content/news/${newsId}`)
      .set('Authorization', `Bearer ${authToken}`)
    expect(detailRes.statusCode).toBe(200)
    expect(detailRes.body.data.article._id).toBe(newsId)

    const updateRes = await request(app)
      .patch(`/api/admin/content/news/${newsId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ summary: 'Updated summary' })
    expect(updateRes.statusCode).toBe(200)
    expect(updateRes.body.data.article.summary).toBe('Updated summary')

    const deleteRes = await request(app)
      .delete(`/api/admin/content/news/${newsId}`)
      .set('Authorization', `Bearer ${authToken}`)
    expect(deleteRes.statusCode).toBe(200)
  })
})

