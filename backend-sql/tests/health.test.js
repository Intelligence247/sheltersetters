const request = require('supertest')
const { setupApp, teardown } = require('./helpers')

describe('Health endpoints', () => {
  let app
  beforeAll(async () => {
    const setup = await setupApp()
    app = setup.app
  })

  afterAll(async () => {
    await teardown()
  })

  test('GET /status returns ok', async () => {
    const res = await request(app).get('/status')
    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
  })

  test('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health')
    expect([200, 204]).toContain(res.statusCode)
  })
})
