import { Usuario } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AppError } from "../utils/appError";
import { env } from "../utils/env";
import { prisma } from "../utils/prisma";

export interface RegisterInput {
  nombre: string;
  password: string;
}

export interface LoginInput {
  nombre: string;
  password: string;
}

export interface PublicUsuario {
  id: number;
  nombre: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResult {
  accessToken: string;
  usuario: PublicUsuario;
}

function toPublicUsuario(usuario: Usuario): PublicUsuario {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    createdAt: usuario.createdAt,
    updatedAt: usuario.updatedAt,
  };
}

function generateAccessToken(userId: number): string {
  return jwt.sign({ userId }, env.jwtSecret, {
    subject: String(userId),
    expiresIn: "7d",
  });
}

export async function registerUsuario(input: RegisterInput): Promise<AuthResult> {
  const existingUsuario: Usuario | null = await prisma.usuario.findUnique({
    where: { nombre: input.nombre },
  });

  if (existingUsuario) {
    throw new AppError("Username already exists", 409);
  }

  const passwordHash: string = await bcrypt.hash(input.password, 10);

  const usuario: Usuario = await prisma.usuario.create({
    data: {
      nombre: input.nombre,
      password: passwordHash,
    },
  });

  return {
    accessToken: generateAccessToken(usuario.id),
    usuario: toPublicUsuario(usuario),
  };
}

export async function loginUsuario(input: LoginInput): Promise<AuthResult> {
  const usuario: Usuario | null = await prisma.usuario.findUnique({
    where: { nombre: input.nombre },
  });

  if (!usuario) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid: boolean = await bcrypt.compare(input.password, usuario.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401);
  }

  return {
    accessToken: generateAccessToken(usuario.id),
    usuario: toPublicUsuario(usuario),
  };
}
