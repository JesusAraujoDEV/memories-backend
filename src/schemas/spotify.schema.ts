import { z } from "zod";

export const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
});

export const proxyQuerySchema = z.object({
  url: z.string().trim().url().max(2048),
});
