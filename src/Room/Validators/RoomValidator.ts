import { Request, Response, NextFunction } from "express";
import { AppError } from '../../utils/AppError';
import { createRoomDTO } from "./CreateRoom.dto";
import { updateRoomDTO } from "./UpdateRoom.dto";

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
