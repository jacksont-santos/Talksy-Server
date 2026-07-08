import request from 'supertest';
import { signupAndSignin } from '../helpers/auth';
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../helpers/mongo-memory';

describe('Security and error handling integration', () => {
  let app;

  beforeAll(async () => {
    process.env.SECRET_KEY = 'integration-secret-key';
    await connectTestDatabase();
    const { createApp } = require('../../src/app');
    app = createApp();
  });

  afterEach(async () => {
    await clearTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it('should return 401 when protected route is called without authorization', async () => {
    const response = await request(app).get('/room/');
    expect(response.status).toBe(401);
    expect(response.body?.message).toBe('Authorization header is missing');
  });

  it('should return 401 when protected route is called with invalid token', async () => {
    const response = await request(app).get('/room/').set('Authorization', 'invalid-token');
    expect(response.status).toBe(401);
    expect(response.body?.message).toBe('Invalid token');
  });

  it('should return 400 for invalid signin payload', async () => {
    const response = await request(app).post('/auth/signin').send({
      username: 'ab',
      password: '123'
    });

    expect(response.status).toBe(400);
    expect(Array.isArray(response.body?.message)).toBe(true);
  });

  it('should return 500 for update endpoint without auth middleware userData', async () => {
    const response = await request(app).put('/user/update').send({
      username: 'validuser',
      password: 'secure123',
      nickname: 'validnick'
    });

    expect(response.status).toBe(500);
  });

  it('should return 500 for invalid invited token path in room service', async () => {
    const { token } = await signupAndSignin(app, {
      username: 'roomownerx',
      password: 'secure123',
      nickname: 'ownerx'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', token).send({
      name: 'Private X',
      maxUsers: 4,
      isPublic: 'false',
      password: 'room1234'
    });

    const roomId = createResponse.body?.data?._id;
    const response = await request(app)
      .get(`/room/invited/${roomId}/token/invalid-invite-token`)
      .set('Authorization', token);

    expect(response.status).toBe(500);
  });
});

