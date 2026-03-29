import { Request, Response, NextFunction } from "express";
import { AppError } from "../../Error/AppError";
import { createUserDTO } from "./CreateUser.dto";
import { updateUserDTO } from "./UpdateUser.dto";

export const validateUserDTO = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const DTO =
    req.method == "POST"
      ? createUserDTO
      : req.method == "PUT"
        ? updateUserDTO
        : null;

  if (!DTO) return next();

  const result = DTO.safeParse(req.body);
  if (!result.success) {
    let message = [];
    result.error.issues.forEach((issue) => {
      message.push(`${issue.path[0]}: ${issue.message}`);
    });
    throw new AppError(400, message);
  }

  req.body = result.data;
  next();
};
