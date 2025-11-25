const fs = require('fs')
const path = require('path')
const request = require('supertest')
const { setupApp, teardown } = require('./helpers')

describe('Uploads endpoint', () => {
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

  test('POST /api/uploads with admin token stores file and returns URL', async () => {
    // Register admin
    const adminPayload = { name: 'Uploader', email: 'uploader@local.test', password: 'password123', registrationSecret: 'test-secret' }
      const registerRes = await request(app).post('/api/auth/register').send(adminPayload)
      expect(registerRes.statusCode).toBe(201)
      const login = await request(app).post('/api/auth/login').send({ email: adminPayload.email, password: adminPayload.password })
      expect(login.statusCode).toBe(200)
    const accessToken = login.body.data.accessToken
    const filePath = path.resolve(__dirname, 'fixtures', 'test.png')
    const res = await request(app)
      .post('/api/uploads')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', filePath)
      .field('folder', 'tests')
    // Local upload controller returns 201 Created (matches original Cloudinary behavior)
    expect(res.statusCode).toBe(201)
    expect(res.body.data).toHaveProperty('url')
    // Validate the file was written
    const uploadsDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads')
    const files = fs.readdirSync(uploadsDir)
    expect(files.length).toBeGreaterThan(0)
  })
})
