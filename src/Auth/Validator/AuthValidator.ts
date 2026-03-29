import { ZodSchema, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from '../../Error/AppError';

const AuthDTO: ZodSchema = z.object({
  username: z.string().min(4, "too short").max(20, "too long"),
  password: z.string().min(6, "too short").max(16, "too long"),
});

export const validateAuthDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let result = AuthDTO.safeParse(req.body);

  if (result && !result.success) {
    let message = [];
    result.error.issues.forEach((issue) => {
      message.push(`${issue.path[0]}: ${issue.message}`);
    });
    throw new AppError(400, message);
  };

  req.body = result.data;
  next();

}
