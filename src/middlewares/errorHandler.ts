import { Request, Response, NextFunction } from "express";
import { AppError } from "../Error/AppError";

export function errorHandler(
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    res
      .status(err.statusCode)
      .send({ message: err.message });
  }
  else {
    res
      .status((err as any)?.status || 500)
      .send({ message: err?.message || "Internal server error" });
  }
}
