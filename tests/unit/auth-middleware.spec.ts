describe('authMiddleware', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.SECRET_KEY = 'middleware-test-secret';
  });

  it('should throw when authorization header is missing', () => {
    const { authMiddleware } = require('../../src/middlewares/authMiddleware');
    const req = { headers: {} } as any;
    const next = jest.fn();

    expect(() => authMiddleware(req, {} as any, next)).toThrow('Authorization header is missing');
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw when token is invalid', () => {
    const { authMiddleware } = require('../../src/middlewares/authMiddleware');
    const req = { headers: { authorization: 'invalid-token' } } as any;
    const next = jest.fn();

    expect(() => authMiddleware(req, {} as any, next)).toThrow('Invalid token');
    expect(next).not.toHaveBeenCalled();
  });

  it('should set userData and call next for valid token', () => {
    const { signJWT } = require('../../src/utils/jwt');
    const { authMiddleware } = require('../../src/middlewares/authMiddleware');
    const token = signJWT({ _id: 'u1', username: 'john', date: new Date() });
    const req = { headers: { authorization: token } } as any;
    const next = jest.fn();

    authMiddleware(req, {} as any, next);

    expect(req.headers.userData).toEqual({ _id: 'u1', username: 'john' });
    expect(next).toHaveBeenCalled();
  });
});

