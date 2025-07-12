import { ZodSchema, z } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from '../utils/appError';

const createRoomDTO: ZodSchema = z.object({
  name: z.string().min(4, "too short").max(20, "too long"),
  password: z.string().min(6, "too short").max(16, "too long").optional(),
  maxUsers: z
    .number()
    .int("Is not Int number")
    .min(2, "Invalid users number")
    .max(10, "Invalid users number"),
  isPublic: z.boolean().optional(),
});

const updateRoomDTO: ZodSchema = z.object({
  name: z.string().min(4, "too short").max(20, "too long").optional(),
  password: z.string().min(6, "too short").max(16, "too long").optional(),
  maxUsers: z
    .number()
    .int("Is not Int number")
    .min(2, "Invalid users number")
    .max(10, "Invalid users number")
    .optional(),
  active: z.boolean().optional(),
  public: z.boolean().optional(),
});

export const validateRoomDTO = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    const DTO =
    req.method == 'POST' ? createRoomDTO : 
    req.method == 'PUT' ? updateRoomDTO :
    null;

    if (!DTO) return next();

  const result = DTO.safeParse(req.body);
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
