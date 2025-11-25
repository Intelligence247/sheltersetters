jest.mock('../src/utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}))

const { sendEmail } = require('../src/utils/email')
const request = require('supertest')
const { setupApp, teardown } = require('./helpers')

describe('Auth extended endpoints', () => {
  let app
  let accessToken
  let refreshToken

  const adminPayload = {
    name: 'Extended Admin',
    email: 'extended-admin@local.test',
    password: 'password123',
    registrationSecret: 'test-secret',
  }

  beforeAll(async () => {
    const setup = await setupApp()
    app = setup.app

    const registerRes = await request(app).post('/api/auth/register').send(adminPayload)
    expect(registerRes.statusCode).toBe(201)

    const loginRes = await request(app).post('/api/auth/login').send({
      email: adminPayload.email,
      password: adminPayload.password,
    })
    expect(loginRes.statusCode).toBe(200)
    accessToken = loginRes.body.data.accessToken
    refreshToken = loginRes.body.data.refreshToken
  })

  afterAll(async () => {
    await teardown()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET /api/auth/me returns the current admin profile', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${accessToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.data.admin).toHaveProperty('email', adminPayload.email)
  })

  test('POST /api/auth/refresh issues new tokens', async () => {
    const res = await request(app).post('/api/auth/refresh').send({ refreshToken })
    expect(res.statusCode).toBe(200)
    accessToken = res.body.data.accessToken
    refreshToken = res.body.data.refreshToken
    expect(accessToken).toBeDefined()
    expect(refreshToken).toBeDefined()
  })

  test('POST /api/auth/logout revokes refresh tokens', async () => {
    const logoutRes = await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${accessToken}`)
    expect(logoutRes.statusCode).toBe(200)

    const refreshRes = await request(app).post('/api/auth/refresh').send({ refreshToken })
    expect(refreshRes.statusCode).toBe(401)
  })

  test('Forgot and reset password flow', async () => {
    const forgotRes = await request(app)
      .post('/api/auth/forgot-password')
      .send({ email: adminPayload.email, baseUrl: 'https://example.com' })
    expect(forgotRes.statusCode).toBe(200)
    expect(sendEmail).toHaveBeenCalled()

    const emailArgs = sendEmail.mock.calls[0][0]
    const tokenMatch = emailArgs.text.match(/Token:\s([a-f0-9]+)/i)
    expect(tokenMatch).toBeTruthy()
    const rawToken = tokenMatch[1]

    const newPassword = 'NewPassword123!'
    const resetRes = await request(app).post('/api/auth/reset-password').send({ token: rawToken, password: newPassword })
    expect(resetRes.statusCode).toBe(200)

    const loginRes = await request(app).post('/api/auth/login').send({
      email: adminPayload.email,
      password: newPassword,
    })
    expect(loginRes.statusCode).toBe(200)
  })
})

