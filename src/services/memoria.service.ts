import { Memoria, Prisma } from "@prisma/client";

import { AppError } from "../utils/appError";
import { prisma } from "../utils/prisma";

export interface CreateMemoriaInput {
  fecha?: Date;
  hora?: string;
  titulo?: string;
  descripcion: string;
  fotoUrl?: string;
  ubicacion?: string;
  moodColor?: string;
  cancionUrl?: string;
}

export interface MemoriasByMonthInput {
  year?: number;
  month?: number;
  day?: number;
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

export async function findMemoriaByIdForUser(userId: number, memoriaId: number): Promise<Memoria> {
  const memoria: Memoria | null = await prisma.memoria.findFirst({
    where: {
      id: memoriaId,
      usuarioId: userId,
    },
  });

  if (!memoria) {
    throw new AppError("Memoria not found", 404);
  }

  return memoria;
}
