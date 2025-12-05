import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If it's not an AppError, wrap it as a 500
  let error = err;

  if (!(err instanceof AppError)) {
    error = new AppError(err.message || "Internal server error", 500);
  }

  const statusCode = (error as AppError).statusCode || 500;

  // Log for server-side debugging
  console.error("🔥 Error:", {
    message: error.message,
    statusCode,
    stack: error.stack,
  });

  res.status(statusCode).json({
    success: false,
    message: error.message,
    code: error.code,
    // Only show stacktrace in dev
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
}
