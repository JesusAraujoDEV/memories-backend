import { NextFunction, Request, Response } from "express";
import { Readable } from "stream";
import { z } from "zod";

import { getSpotifyPreviewStream, searchSpotifyTracks } from "../services/spotify.service";

const searchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200),
});

const proxyQuerySchema = z.object({
  url: z.string().trim().url().max(2048),
});

interface ValidationErrorResponse {
  message: string;
  details: string[];
}

function sendValidationError(res: Response, error: z.ZodError): void {
  const payload: ValidationErrorResponse = {
    message: "Validation failed",
    details: error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`),
  };

  res.status(400).json(payload);
}

export async function spotifySearch(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedQuery = searchQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    sendValidationError(res, parsedQuery.error);
    return;
  }

  try {
    const tracks = await searchSpotifyTracks(parsedQuery.data.q);
    res.status(200).json(tracks);
  } catch (error: unknown) {
    next(error);
  }
}

export async function spotifyProxy(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsedQuery = proxyQuerySchema.safeParse(req.query);

  if (!parsedQuery.success) {
    sendValidationError(res, parsedQuery.error);
    return;
  }

  try {
    const audioStream: Readable = await getSpotifyPreviewStream(parsedQuery.data.url);

    res.setHeader("Content-Type", "audio/mpeg");
    audioStream.on("error", () => {
      if (!res.headersSent) {
        next(new Error("Error while streaming Spotify audio"));
      }
    });

    audioStream.pipe(res);
  } catch (error: unknown) {
    next(error);
  }
}
