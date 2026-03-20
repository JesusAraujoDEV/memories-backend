import { Memoria, Prisma } from "@prisma/client";

import { AppError } from "../utils/appError";
import { prisma } from "../utils/prisma";

export interface CreateMemoriaInput {
  fecha?: Date | null;
  hora?: string | null;
  titulo?: string | null;
  descripcion: string;
  fotoUrl?: string | null;
  ubicacion?: string | null;
  moodColor?: string | null;
  cancionUrl?: string | null;
}

export interface MemoriasByMonthInput {
  year?: number;
  month?: number;
  day?: number;
}

export interface UpdateMemoriaInput {
  fecha?: Date | null;
  hora?: string | null;
  titulo?: string | null;
  descripcion?: string | null;
  fotoUrl?: string | null;
  ubicacion?: string | null;
  moodColor?: string | null;
  cancionUrl?: string | null;
}

const memoriaWithAuthorSelect = Prisma.validator<Prisma.MemoriaDefaultArgs>()({
  include: {
    usuario: {
      select: {
        id: true,
        nombre: true,
      },
    },
  },
});

export type MemoriaWithAuthor = Prisma.MemoriaGetPayload<typeof memoriaWithAuthorSelect>;

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface MemoriaOwnershipRecord {
  id: number;
  usuarioId: number;
}

function buildDateRange(year: number, month: number, day?: number): DateRange {
  if (day !== undefined) {
    return {
      startDate: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)),
      endDate: new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0, 0)),
    };
  }

  return {
    startDate: new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0)),
    endDate: new Date(Date.UTC(year, month, 1, 0, 0, 0, 0)),
  };
}

export async function createMemoriaForUser(userId: number, input: CreateMemoriaInput): Promise<Memoria> {
  const usuarioExists: boolean =
    (await prisma.usuario.count({
      where: { id: userId },
    })) > 0;

  if (!usuarioExists) {
    throw new AppError("Authenticated user does not exist", 401);
  }

  return prisma.memoria.create({
    data: {
      usuarioId: userId,
      fecha: input.fecha ?? new Date(),
      hora: input.hora,
      titulo: input.titulo ?? "Sin titulo",
      descripcion: input.descripcion,
      fotoUrl: input.fotoUrl,
      ubicacion: input.ubicacion,
      moodColor: input.moodColor,
      cancionUrl: input.cancionUrl,
    },
  });
}

export async function findMemoriasByMonth(input: MemoriasByMonthInput): Promise<MemoriaWithAuthor[]> {
  const where: Prisma.MemoriaWhereInput = {};

  if (input.year !== undefined && input.month !== undefined) {
    const { startDate, endDate }: DateRange = buildDateRange(input.year, input.month, input.day);

    where.fecha = {
      gte: startDate,
      lt: endDate,
    };
  }

  return prisma.memoria.findMany({
    where,
    include: memoriaWithAuthorSelect.include,
    orderBy: [{ fecha: "desc" }, { hora: "desc" }, { id: "desc" }],
  });
}

async function validateMemoriaOwnership(userId: number, memoriaId: number): Promise<MemoriaOwnershipRecord> {
  const memoria: MemoriaOwnershipRecord | null = await prisma.memoria.findUnique({
    where: { id: memoriaId },
    select: {
      id: true,
      usuarioId: true,
    },
  });

  if (!memoria) {
    throw new AppError("Memoria not found", 404);
  }

  if (memoria.usuarioId !== userId) {
    throw new AppError("You are not authorized to modify this memoria", 401);
  }

  return memoria;
}

export async function updateMemoriaForUser(
  userId: number,
  memoriaId: number,
  input: UpdateMemoriaInput,
): Promise<MemoriaWithAuthor> {
  await validateMemoriaOwnership(userId, memoriaId);

  const updateData: Prisma.MemoriaUpdateInput = {};

  if (input.fecha !== undefined && input.fecha !== null) {
    updateData.fecha = input.fecha;
  }

  if (input.hora !== undefined) {
    updateData.hora = input.hora;
  }

  if (input.titulo !== undefined && input.titulo !== null) {
    updateData.titulo = input.titulo;
  }

  if (input.descripcion !== undefined) {
    updateData.descripcion = input.descripcion;
  }

  if (input.fotoUrl !== undefined) {
    updateData.fotoUrl = input.fotoUrl;
  }

  if (input.ubicacion !== undefined) {
    updateData.ubicacion = input.ubicacion;
  }

  if (input.moodColor !== undefined) {
    updateData.moodColor = input.moodColor;
  }

  if (input.cancionUrl !== undefined) {
    updateData.cancionUrl = input.cancionUrl;
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError("At least one field must be provided to update memoria", 400);
  }

  return prisma.memoria.update({
    where: { id: memoriaId },
    data: updateData,
    include: memoriaWithAuthorSelect.include,
  });
}

export async function deleteMemoriaForUser(userId: number, memoriaId: number): Promise<void> {
  await validateMemoriaOwnership(userId, memoriaId);

  await prisma.memoria.delete({
    where: { id: memoriaId },
  });
}

export async function findMemoriaByIdForUser(userId: number, memoriaId: number): Promise<MemoriaWithAuthor> {
  const memoria: MemoriaWithAuthor | null = await prisma.memoria.findFirst({
    where: {
      id: memoriaId,
      usuarioId: userId,
    },
    include: memoriaWithAuthorSelect.include,
  });

  if (!memoria) {
    throw new AppError("Memoria not found", 404);
  }

  return memoria;
}
