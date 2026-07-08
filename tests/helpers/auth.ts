import request from 'supertest';

export const signupAndSignin = async (
  app,
  payload: { username: string; password: string; nickname: string }
) => {
  const signupResponse = await request(app).post('/user/signup').send(payload);
  const signinResponse = await request(app)
    .post('/auth/signin')
    .send({ username: payload.username, password: payload.password });

  return {
    signupResponse,
    signinResponse,
    token: signinResponse.body?.data?.token as string
  };
};

