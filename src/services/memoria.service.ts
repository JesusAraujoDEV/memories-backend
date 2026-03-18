import { Memoria } from "@prisma/client";

import { AppError } from "../utils/appError";
import { prisma } from "../utils/prisma";

export interface CreateMemoriaInput {
  fecha: Date;
  hora?: string;
  titulo: string;
  descripcion?: string;
  fotoUrl?: string;
  ubicacion?: string;
  moodColor?: string;
  cancionUrl?: string;
}

export interface MemoriasByMonthInput {
  userId: number;
  year: number;
  month: number;
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
      fecha: input.fecha,
      hora: input.hora,
      titulo: input.titulo,
      descripcion: input.descripcion,
      fotoUrl: input.fotoUrl,
      ubicacion: input.ubicacion,
      moodColor: input.moodColor,
      cancionUrl: input.cancionUrl,
    },
  });
}

export async function findMemoriasByMonth(input: MemoriasByMonthInput): Promise<Memoria[]> {
  const startDate: Date = new Date(Date.UTC(input.year, input.month - 1, 1, 0, 0, 0, 0));
  const endDate: Date = new Date(Date.UTC(input.year, input.month, 1, 0, 0, 0, 0));

  return prisma.memoria.findMany({
    where: {
      usuarioId: input.userId,
      fecha: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: [{ fecha: "asc" }, { hora: "asc" }, { id: "asc" }],
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
