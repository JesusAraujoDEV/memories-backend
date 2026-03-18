import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AuthResult, LoginInput, RegisterInput, loginUsuario, registerUsuario } from "../services/auth.service";

const registerSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "nombre must contain at least 3 characters")
    .max(80, "nombre must contain at most 80 characters"),
  password: z.string().min(4, "password must contain at least 4 characters").max(128),
});

const loginSchema = z.object({
  nombre: z.string().trim().min(1, "nombre is required"),
  password: z.string().min(1, "password is required"),
});

interface ValidationErrorResponse {
  message: string;
  details: string[];
}

function sendValidationError(res: Response, error: z.ZodError): void {
  const responsePayload: ValidationErrorResponse = {
    message: "Validation failed",
    details: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };

  res.status(400).json(responsePayload);
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedBody = registerSchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendValidationError(res, parsedBody.error);
    return;
  }

  const input: RegisterInput = parsedBody.data;

  try {
    const result: AuthResult = await registerUsuario(input);
    res.status(201).json(result);
  } catch (error: unknown) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendValidationError(res, parsedBody.error);
    return;
  }

  const input: LoginInput = parsedBody.data;

  try {
    const result: AuthResult = await loginUsuario(input);
    res.status(200).json(result);
  } catch (error: unknown) {
    next(error);
  }
}
