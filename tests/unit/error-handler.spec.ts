import { AppError } from '../../src/Error/AppError';
import { errorHandler } from '../../src/middlewares/errorHandler';

describe('errorHandler middleware', () => {
  it('should return AppError status and message', () => {
    const status = jest.fn().mockReturnThis();
    const send = jest.fn();
    const res = { status, send } as any;

    errorHandler(new AppError(404, 'Not found'), {} as any, res, jest.fn());

    expect(status).toHaveBeenCalledWith(404);
    expect(send).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('should return 500 for unknown errors without status', () => {
    const status = jest.fn().mockReturnThis();
    const send = jest.fn();
    const res = { status, send } as any;

    errorHandler(new Error('boom'), {} as any, res, jest.fn());

    expect(status).toHaveBeenCalledWith(500);
    expect(send).toHaveBeenCalledWith({ message: 'boom' });
  });
});

