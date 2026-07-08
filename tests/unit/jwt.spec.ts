describe('jwt utils', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.SECRET_KEY = 'unit-test-secret-key';
  });

  it('signJWT should generate a token and verifyToken should decode it', () => {
    const { signJWT, verifyToken } = require('../../src/utils/jwt');
    const payload = { _id: 'u-1', username: 'tester', date: new Date() };
    const token = signJWT(payload);

    expect(typeof token).toBe('string');
    const decoded = verifyToken(token);
    expect(decoded).toBeTruthy();
    expect(decoded._id).toBe(payload._id);
  });

  it('verifyToken should return null for invalid token', () => {
    const { verifyToken } = require('../../src/utils/jwt');

    expect(verifyToken('invalid-token')).toBeNull();
  });
});

