import request from 'supertest';
import { signupAndSignin } from '../helpers/auth';
import { clearTestDatabase, connectTestDatabase, disconnectTestDatabase } from '../helpers/mongo-memory';

describe('Auth integration', () => {
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

  it('should create user and sign in successfully', async () => {
    const signupPayload = {
      username: 'johnuser',
      password: 'secure123',
      nickname: 'johnnick'
    };

    const { signupResponse, signinResponse } = await signupAndSignin(app, signupPayload);
    expect(signupResponse.status).toBe(201);
    expect(signupResponse.body?.data?.username).toBe(signupPayload.username);

    expect(signinResponse.status).toBe(200);
    expect(signinResponse.body?.data?.token).toBeTruthy();
    expect(signinResponse.body?.data?.username).toBe(signupPayload.username);
  });

  it('should reject sign in with wrong password', async () => {
    const signupPayload = {
      username: 'mariauser',
      password: 'secure123',
      nickname: 'marianick'
    };

    await request(app).post('/user/signup').send(signupPayload);

    const signinResponse = await request(app)
      .post('/auth/signin')
      .send({ username: signupPayload.username, password: 'wrong-pass' });

    expect(signinResponse.status).toBe(401);
    expect(signinResponse.body?.message).toBe('Invalid username or password');
  });
});

