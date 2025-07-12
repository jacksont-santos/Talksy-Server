import { ZodSchema, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from '../utils/appError';

const authDTO: ZodSchema = z.object({
  username: z.string().min(4, "too short").max(20, "too long"),
  password: z.string().min(6, "too short").max(16, "too long"),
});

export const validateUserAuthDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = authDTO.safeParse(req.body);

  if (!result.success) {
    let message = [];
    result.error.issues.forEach((issue) => {
      message.push(`${issue.path[0]}: ${issue.message}`);
    });
    throw new AppError(400, message);
  };

  req.body = result.data;
  next();
};
