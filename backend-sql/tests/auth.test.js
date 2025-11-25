const request = require('supertest')
const { setupApp, teardown } = require('./helpers')

describe('Auth endpoints', () => {
  let app
  let models
  beforeAll(async () => {
    const setup = await setupApp()
    app = setup.app
    models = setup.models
  })

  afterAll(async () => {
    await teardown()
  })

  const adminPayload = {
    name: 'Test Admin',
    email: 'test-admin@local.test',
    password: 'password123',
    registrationSecret: 'test-secret',
  }

  test('POST /api/auth/register returns created admin and tokens', async () => {
    const res = await request(app).post('/api/auth/register').send(adminPayload)
    expect(res.statusCode).toBe(201)
    expect(res.body.data).toHaveProperty('accessToken')
    expect(res.body.data).toHaveProperty('refreshToken')
    expect(res.body.data.admin).toHaveProperty('_id')
  })

  test('POST /api/auth/login returns tokens', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: adminPayload.email, password: adminPayload.password })
    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveProperty('accessToken')
  })
})
