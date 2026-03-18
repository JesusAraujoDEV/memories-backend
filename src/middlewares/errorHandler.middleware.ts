import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/appError";

interface ErrorPayload {
  message: string;
}

export function notFoundMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError("Resource not found", 404));
}

export function errorHandlerMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    const payload: ErrorPayload = {
      message: error.message,
    };

    res.status(error.statusCode).json(payload);
    return;
  }

  const payload: ErrorPayload = {
    message: "Internal server error",
  };

  res.status(500).json(payload);
}
