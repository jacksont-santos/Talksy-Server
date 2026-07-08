import request from 'supertest';
import { signupAndSignin } from '../helpers/auth';
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../helpers/mongo-memory';

describe('User flow E2E', () => {
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

  it('should run healthcheck, signup, signin and fetch profile', async () => {
    const healthResponse = await request(app).get('/health');
    expect(healthResponse.status).toBe(200);
    expect(healthResponse.text).toBe('manager ok');

    const signupPayload = {
      username: 'aliceuser',
      password: 'secure123',
      nickname: 'alicenick'
    };

    const { signupResponse, token } = await signupAndSignin(app, signupPayload);
    expect(signupResponse.status).toBe(201);
    expect(token).toBeTruthy();

    const getProfileResponse = await request(app).get('/user/').set('Authorization', token);
    expect(getProfileResponse.status).toBe(200);
    expect(getProfileResponse.body?.data?.username).toBe(signupPayload.username);
  });
});

