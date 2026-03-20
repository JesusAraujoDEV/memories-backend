import { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { AuthenticatedRequest } from "../types/auth";
import {
  CreateMemoriaInput,
  MemoriasByMonthInput,
  createMemoriaForUser,
  deleteMemoriaForUser,
  findMemoriaByIdForUser,
  findMemoriasByMonth,
  updateMemoriaForUser,
} from "../services/memoria.service";
import { AppError } from "../utils/appError";

const optionalSongUrlSchema = z.preprocess(
  (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string") {
      const trimmedValue: string = value.trim();
      return trimmedValue.length === 0 ? undefined : trimmedValue;
    }

    return value;
  },
  z.string().optional(),
);

const optionalPhotoUrlSchema = z.preprocess(
  (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string") {
      const trimmedValue: string = value.trim();
      return trimmedValue.length === 0 ? undefined : trimmedValue;
    }

    return value;
  },
  z.string().url().max(2048).optional(),
);

const optionalYearQuerySchema = z.preprocess(
  (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string" && value.trim().length === 0) {
      return undefined;
    }

    return value;
  },
  z.coerce.number().int().min(1970).max(3000).optional(),
);

const optionalMonthQuerySchema = z.preprocess(
  (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string" && value.trim().length === 0) {
      return undefined;
    }

    return value;
  },
  z.coerce.number().int().min(1).max(12).optional(),
);

const optionalDayQuerySchema = z.preprocess(
  (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "string" && value.trim().length === 0) {
      return undefined;
    }

    return value;
  },
  z.coerce.number().int().min(1).max(31).optional(),
);

const createMemoriaSchema = z.object({
  fecha: z.coerce.date().optional(),
  hora: z.string().trim().min(1).max(20).optional(),
  titulo: z.string().trim().min(1).max(200).optional(),
  descripcion: z.string().trim().min(1).max(5000),
  fotoUrl: optionalPhotoUrlSchema,
  ubicacion: z.string().trim().max(255).optional(),
  moodColor: z.string().trim().max(32).optional(),
  cancionUrl: optionalSongUrlSchema,
});

const patchMemoriaSchema = z.preprocess(
  (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return {};
    }

    return value;
  },
  createMemoriaSchema.partial(),
);

const monthQuerySchema = z
  .object({
    year: optionalYearQuerySchema,
    month: optionalMonthQuerySchema,
    day: optionalDayQuerySchema,
  })
  .superRefine((value, context) => {
    const hasYear: boolean = value.year !== undefined;
    const hasMonth: boolean = value.month !== undefined;

    if (hasYear !== hasMonth) {
      if (!hasYear) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["year"],
          message: "year is required when month is provided",
        });
      }

      if (!hasMonth) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["month"],
          message: "month is required when year is provided",
        });
      }

      return;
    }

    if (!hasYear && value.day !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["day"],
        message: "day requires year and month",
      });
      return;
    }

    if (value.day === undefined) {
      return;
    }

    const year: number = value.year as number;
    const month: number = value.month as number;
    const daysInMonth: number = new Date(Date.UTC(year, month, 0)).getUTCDate();

    if (value.day > daysInMonth) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["day"],
        message: `day must be between 1 and ${daysInMonth} for month ${month} and year ${year}`,
      });
    }
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
