const request = require('supertest')
const { setupApp, teardown } = require('./helpers')

describe('Admin routes', () => {
  let app
  let authToken
  let superAdmin

  const superAdminPayload = {
    name: 'Super Admin',
    email: 'super-admin@local.test',
    password: 'password123',
    registrationSecret: 'test-secret',
  }

  beforeAll(async () => {
    const setup = await setupApp()
    app = setup.app

    const registerRes = await request(app).post('/api/auth/register').send(superAdminPayload)
    expect(registerRes.statusCode).toBe(201)
    superAdmin = registerRes.body.data.admin

    const loginRes = await request(app).post('/api/auth/login').send({
      email: superAdminPayload.email,
      password: superAdminPayload.password,
    })
    expect(loginRes.statusCode).toBe(200)
    authToken = loginRes.body.data.accessToken
  })

  afterAll(async () => {
    await teardown()
  })

  test('GET /api/admin/dashboard/overview returns metrics', async () => {
    const res = await request(app).get('/api/admin/dashboard/overview').set('Authorization', `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveProperty('metrics')
    expect(res.body.data.metrics).toHaveProperty('enquiries')
    expect(res.body.data).toHaveProperty('recentMessages')
    expect(Array.isArray(res.body.data.recentMessages)).toBe(true)
  })

  test('GET /api/admin/users lists admins', async () => {
    const res = await request(app).get('/api/admin/users').set('Authorization', `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.data.admins)).toBe(true)
    expect(res.body.data.admins.length).toBeGreaterThanOrEqual(1)
    expect(res.body.data.admins[0]).toHaveProperty('_id')
  })

  test('POST /api/admin/users creates new admin and PATCH updates role', async () => {
    const newAdminPayload = {
      name: 'Content Manager',
      email: 'content-manager@local.test',
      password: 'password123',
      role: 'content_manager',
    }

    const createRes = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newAdminPayload)
    expect(createRes.statusCode).toBe(201)
    expect(createRes.body.data.admin).toHaveProperty('_id')
    expect(createRes.body.data.admin.role).toBe('content_manager')

    const adminId = createRes.body.data.admin._id
    const updateRes = await request(app)
      .patch(`/api/admin/users/${adminId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ role: 'customer_care', isActive: false })
    expect(updateRes.statusCode).toBe(200)
    expect(updateRes.body.data.admin.role).toBe('customer_care')
    expect(updateRes.body.data.admin.isActive).toBe(false)
  })
})

