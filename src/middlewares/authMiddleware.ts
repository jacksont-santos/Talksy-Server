import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/appError';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;

  if (!authorization)
    throw new AppError(401, 'Authorization header is missing');

  const user = verifyToken(authorization);
  if (!user)
    throw new AppError(401, 'Invalid token');

  (req.headers as any).userData = { _id: user._id, username: user.username };
  next();
};