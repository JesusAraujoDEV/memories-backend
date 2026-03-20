import { z } from "zod";

export const registerSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "nombre must contain at least 3 characters")
    .max(80, "nombre must contain at most 80 characters"),
  password: z.string().min(4, "password must contain at least 4 characters").max(128),
});

export const loginSchema = z.object({
  nombre: z.string().trim().min(1, "nombre is required"),
  password: z.string().min(1, "password is required"),
});
