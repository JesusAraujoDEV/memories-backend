import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";

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
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2021") {
      const payload: ErrorPayload = {
        message: "Database table does not exist in configured schema. Verify migration and schema configuration.",
      };

      res.status(500).json(payload);
      return;
    }
  }

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
