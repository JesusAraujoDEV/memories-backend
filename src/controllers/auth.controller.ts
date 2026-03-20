import { NextFunction, Request, Response } from "express";

import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { AuthResult, LoginInput, RegisterInput, loginUsuario, registerUsuario } from "../services/auth.service";
import { sendValidationError } from "../utils/validation.util";

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
