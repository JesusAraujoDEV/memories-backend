import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AuthenticatedRequest } from "../types/auth";
import {
  CreateMemoriaInput,
  MemoriasByMonthInput,
  createMemoriaForUser,
  findMemoriaByIdForUser,
  findMemoriasByMonth,
} from "../services/memoria.service";
import { AppError } from "../utils/appError";

const createMemoriaSchema = z.object({
  fecha: z.coerce.date(),
  hora: z.string().trim().min(1).max(20).optional(),
  titulo: z.string().trim().min(1).max(200),
  descripcion: z.string().trim().max(5000).optional(),
  fotoUrl: z.url().max(2048).optional(),
  ubicacion: z.string().trim().max(255).optional(),
  moodColor: z.string().trim().max(32).optional(),
  cancionUrl: z.url().max(2048).optional(),
});

const monthQuerySchema = z.object({
  year: z.coerce.number().int().min(1970).max(3000),
  month: z.coerce.number().int().min(1).max(12),
});

const memoriaIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

interface ValidationErrorResponse {
  message: string;
  details: string[];
}

function getAuthenticatedUserId(req: Request): number {
  const typedRequest: AuthenticatedRequest = req;
  const userId: number | undefined = typedRequest.authUserId;

  if (!userId) {
    throw new AppError("User is not authenticated", 401);
  }

  return userId;
}

function sendValidationError(res: Response, error: z.ZodError): void {
  const responsePayload: ValidationErrorResponse = {
    message: "Validation failed",
    details: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };

  res.status(400).json(responsePayload);
}

export async function createMemoria(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedBody = createMemoriaSchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendValidationError(res, parsedBody.error);
    return;
  }

  try {
    const userId: number = getAuthenticatedUserId(req);
    const input: CreateMemoriaInput = parsedBody.data;
    const memoria = await createMemoriaForUser(userId, input);

    res.status(201).json(memoria);
  } catch (error: unknown) {
    next(error);
  }
}

export async function getMemoriasByMonth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedQuery = monthQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    sendValidationError(res, parsedQuery.error);
    return;
  }

  try {
    const userId: number = getAuthenticatedUserId(req);

    const input: MemoriasByMonthInput = {
      userId,
      year: parsedQuery.data.year,
      month: parsedQuery.data.month,
    };

    const memorias = await findMemoriasByMonth(input);
    res.status(200).json(memorias);
  } catch (error: unknown) {
    next(error);
  }
}

export async function getMemoriaById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedParams = memoriaIdSchema.safeParse(req.params);

  if (!parsedParams.success) {
    sendValidationError(res, parsedParams.error);
    return;
  }

  try {
    const userId: number = getAuthenticatedUserId(req);
    const memoria = await findMemoriaByIdForUser(userId, parsedParams.data.id);
    res.status(200).json(memoria);
  } catch (error: unknown) {
    next(error);
  }
}
