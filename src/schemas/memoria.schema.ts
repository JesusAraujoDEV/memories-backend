import { z } from "zod";

const optionalQueryNumber = (min: number, max: number) =>
  z
    .union([z.coerce.number().int().min(min).max(max), z.literal(""), z.undefined()])
    .transform((value): number | undefined => (value === "" ? undefined : value));

const optionalPhotoUrlSchema = z.union([z.string().url().max(2048), z.literal("")]).nullish();

export const createMemoriaSchema = z.object({
  descripcion: z.string().trim().min(1).max(5000),
  fecha: z.coerce.date().nullish(),
  hora: z.string().trim().nullish(),
  titulo: z.string().trim().nullish(),
  fotoUrl: optionalPhotoUrlSchema,
  ubicacion: z.string().trim().nullish(),
  moodColor: z.string().trim().nullish(),
  cancionUrl: z.string().trim().nullish(),
});

export const patchMemoriaSchema = createMemoriaSchema.partial();

export const monthQuerySchema = z
  .object({
    year: optionalQueryNumber(1970, 3000),
    month: optionalQueryNumber(1, 12),
    day: optionalQueryNumber(1, 31),
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

    if (value.day === undefined || value.year === undefined || value.month === undefined) {
      return;
    }

    const daysInMonth: number = new Date(Date.UTC(value.year, value.month, 0)).getUTCDate();

    if (value.day > daysInMonth) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["day"],
        message: `day must be between 1 and ${daysInMonth} for month ${value.month} and year ${value.year}`,
      });
    }
  });

export const memoriaIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});
