import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("UNEXPECTED ERROR: ", err);
  return res.status(500).json({
    status: "error",
    message: "An unexpected error occurred. Please try again later.",
  });
};
