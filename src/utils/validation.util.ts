import { Response } from "express";
import { ZodError } from "zod";

export interface ValidationErrorResponse {
  message: string;
  details: string[];
}

export function sendValidationError(res: Response, error: ZodError): void {
  const payload: ValidationErrorResponse = {
    message: "Validation failed",
    details: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };

  res.status(400).json(payload);
}
