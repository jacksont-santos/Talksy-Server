import request from 'supertest';
import { signupAndSignin } from '../helpers/auth';
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../helpers/mongo-memory';

describe('Room owner flow E2E', () => {
  let app;

  beforeAll(async () => {
    process.env.SECRET_KEY = 'e2e-secret-key';
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

  it('should create, list and delete a room as owner', async () => {
    const { token } = await signupAndSignin(app, {
      username: 'e2eowner1',
      password: 'secure123',
      nickname: 'e2eownernick'
    });

    const createResponse = await request(app).post('/room/create').set('Authorization', token).send({
      name: 'E2E Room',
      maxUsers: 8,
      isPublic: 'true'
    });
    expect(createResponse.status).toBe(201);
    const roomId = createResponse.body?.data?._id;

    const listResponse = await request(app).get('/room/').set('Authorization', token);
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body?.data)).toBe(true);
    expect(listResponse.body.data.some((room) => room._id === roomId)).toBe(true);

    const deleteResponse = await request(app).delete(`/room/delete/${roomId}`).set('Authorization', token);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body?.data?._id).toBe(roomId);
  });
});

