import { NextFunction, Request, Response } from "express";

import { AuthenticatedRequest } from "../types/auth";
import {
  CreateMemoriaInput,
  MemoriasByMonthInput,
  createMemoriaForUser,
  deleteMemoriaForUser,
  findMemoriaByIdForUser,
  findMemoriasByMonth,
  reorderMemoriasForUser,
  updateMemoriaForUser,
} from "../services/memoria.service";
import {
  createMemoriaSchema,
  memoriaIdSchema,
  monthQuerySchema,
  patchMemoriaSchema,
  reorderMemoriasSchema,
} from "../schemas/memoria.schema";
import { AppError } from "../utils/appError";
import { sendValidationError } from "../utils/validation.util";

function getAuthenticatedUserId(req: Request): number {
  const typedRequest: AuthenticatedRequest = req;
  const userId: number | undefined = typedRequest.authUserId;

  if (!userId) {
    throw new AppError("User is not authenticated", 401);
  }

  return userId;
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
    getAuthenticatedUserId(req);

    const input: MemoriasByMonthInput = {
      year: parsedQuery.data.year,
      month: parsedQuery.data.month,
      day: parsedQuery.data.day,
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

export async function patchMemoria(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedParams = memoriaIdSchema.safeParse(req.params);

  if (!parsedParams.success) {
    sendValidationError(res, parsedParams.error);
    return;
  }

  const parsedBody = patchMemoriaSchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendValidationError(res, parsedBody.error);
    return;
  }

  try {
    const userId: number = getAuthenticatedUserId(req);
    const memoria = await updateMemoriaForUser(userId, parsedParams.data.id, parsedBody.data);
    res.status(200).json(memoria);
  } catch (error: unknown) {
    next(error);
  }
}

export async function deleteMemoria(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedParams = memoriaIdSchema.safeParse(req.params);

  if (!parsedParams.success) {
    sendValidationError(res, parsedParams.error);
    return;
  }

  try {
    const userId: number = getAuthenticatedUserId(req);
    await deleteMemoriaForUser(userId, parsedParams.data.id);
    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
}

export async function reorderMemorias(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedBody = reorderMemoriasSchema.safeParse(req.body);

  if (!parsedBody.success) {
    sendValidationError(res, parsedBody.error);
    return;
  }

  try {
    const userId: number = getAuthenticatedUserId(req);
    await reorderMemoriasForUser(userId, parsedBody.data);
    res.status(200).json({ message: "Memorias reordered successfully" });
  } catch (error: unknown) {
    next(error);
  }
}
