import { NextFunction, Request, Response } from "express";
import { Readable } from "stream";

import { proxyQuerySchema, searchQuerySchema } from "../schemas/spotify.schema";
import { getSpotifyPreviewStream, searchSpotifyTracks } from "../services/spotify.service";
import { sendValidationError } from "../utils/validation.util";

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
