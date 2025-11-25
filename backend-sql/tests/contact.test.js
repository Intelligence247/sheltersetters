jest.mock('../src/utils/email', () => ({
  sendEmail: jest.fn().mockResolvedValue(undefined),
}))

const { sendEmail } = require('../src/utils/email')
const request = require('supertest')
const { setupApp, teardown } = require('./helpers')

describe('Contact routes', () => {
  let app
  let authToken
  let createdMessageId

  const adminPayload = {
    name: 'Contact Admin',
    email: 'contact-admin@local.test',
    password: 'password123',
    registrationSecret: 'test-secret',
  }

  beforeAll(async () => {
    const setup = await setupApp()
    app = setup.app

    const register = await request(app).post('/api/auth/register').send(adminPayload)
    expect(register.statusCode).toBe(201)

    const login = await request(app).post('/api/auth/login').send({ email: adminPayload.email, password: adminPayload.password })
    expect(login.statusCode).toBe(200)
    authToken = login.body.data.accessToken
  })

  afterAll(async () => {
    await teardown()
  })

  test('POST /api/contact accepts public submissions', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      message: 'I would like to know more about your services.',
    }

    const res = await request(app).post('/api/contact').send(payload)
    expect(res.statusCode).toBe(201)
    expect(res.body.data).toHaveProperty('message')
    expect(res.body.data.message).toHaveProperty('_id')
    createdMessageId = res.body.data.message._id
  })

  test('GET /api/contact lists messages for admins', async () => {
    const res = await request(app).get('/api/contact').set('Authorization', `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.data).toHaveProperty('messages')
    expect(Array.isArray(res.body.data.messages)).toBe(true)
    expect(res.body.data.pagination).toHaveProperty('total')
  })

  test('PATCH /api/contact/:id updates message status', async () => {
    expect(createdMessageId).toBeDefined()
    const res = await request(app)
      .patch(`/api/contact/${createdMessageId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ status: 'in_progress', notes: 'Following up' })
    expect(res.statusCode).toBe(200)
    expect(res.body.data.message.status).toBe('in_progress')
    expect(res.body.data.message.notes).toBe('Following up')
  })

  test('POST /api/contact/:id/reply closes message and sends email', async () => {
    expect(createdMessageId).toBeDefined()
    const res = await request(app)
      .post(`/api/contact/${createdMessageId}/reply`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ reply: 'Thanks for reaching out!', status: 'closed' })
    expect(res.statusCode).toBe(200)
    expect(res.body.data.message.status).toBe('closed')
    expect(sendEmail).toHaveBeenCalled()
  })
})

