import axios, { AxiosError } from "axios";
import { Readable } from "stream";

import { env } from "../utils/env";
import { AppError } from "../utils/appError";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyImage {
  url: string;
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyTrackItem {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    images: SpotifyImage[];
  };
  preview_url: string | null;
}

interface SpotifySearchTracksResponse {
  tracks: {
    items: SpotifyTrackItem[];
  };
}

interface SpotifyTokenCache {
  accessToken: string;
  expiresAtMs: number;
}

export interface SpotifyTrackSearchResult {
  id: string;
  name: string;
  artist: string;
  albumArt: string | null;
  previewUrl: string | null;
}

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";
const TOKEN_REFRESH_BUFFER_MS = 30_000;

let tokenCache: SpotifyTokenCache | null = null;

function isAllowedSpotifyPreviewUrl(previewUrl: string): URL {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(previewUrl);
  } catch {
    throw new AppError("Invalid preview URL", 400);
  }

  const hostname: string = parsedUrl.hostname.toLowerCase();
  const isSpotifyAudioHost: boolean = hostname === "scdn.co" || hostname.endsWith(".scdn.co");

  if (parsedUrl.protocol !== "https:" || !isSpotifyAudioHost) {
    throw new AppError("Preview URL host is not allowed", 403);
  }

  return parsedUrl;
}

async function fetchSpotifyAccessToken(): Promise<SpotifyTokenCache> {
  const encodedCredentials: string = Buffer.from(`${env.spotifyClientId}:${env.spotifyClientSecret}`).toString("base64");
  const requestBody: URLSearchParams = new URLSearchParams({
    grant_type: "client_credentials",
  });

  try {
    const response = await axios.post<SpotifyTokenResponse>(SPOTIFY_TOKEN_URL, requestBody.toString(), {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 10_000,
    });

    const accessToken: string = response.data.access_token;
    const expiresInSeconds: number = response.data.expires_in;

    if (!accessToken || expiresInSeconds <= 0) {
      throw new AppError("Spotify token response is invalid", 502);
    }

    return {
      accessToken,
      expiresAtMs: Date.now() + expiresInSeconds * 1000,
    };
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to authenticate with Spotify", 502);
  }
}

async function getSpotifyAccessToken(): Promise<string> {
  const now: number = Date.now();
  const shouldRefreshToken: boolean =
    !tokenCache || tokenCache.expiresAtMs - TOKEN_REFRESH_BUFFER_MS <= now;

  if (shouldRefreshToken) {
    tokenCache = await fetchSpotifyAccessToken();
  }

  if (!tokenCache) {
    throw new AppError("Spotify token cache is unavailable", 502);
  }

  return tokenCache.accessToken;
}

export async function searchSpotifyTracks(query: string): Promise<SpotifyTrackSearchResult[]> {
  const accessToken: string = await getSpotifyAccessToken();

  try {
    const response = await axios.get<SpotifySearchTracksResponse>(SPOTIFY_SEARCH_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: query,
        type: "track",
        limit: 5,
      },
      timeout: 10_000,
    });

    return response.data.tracks.items.map((track: SpotifyTrackItem): SpotifyTrackSearchResult => ({
      id: track.id,
      name: track.name,
      artist: track.artists[0]?.name ?? "Unknown artist",
      albumArt: track.album.images[0]?.url ?? null,
      previewUrl: track.preview_url,
    }));
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      tokenCache = null;
    }

    throw new AppError("Failed to search tracks on Spotify", 502);
  }
}

export async function getSpotifyPreviewStream(previewUrl: string): Promise<Readable> {
  const safeUrl: URL = isAllowedSpotifyPreviewUrl(previewUrl);

  try {
    const response = await axios.get<Readable>(safeUrl.toString(), {
      responseType: "stream",
      timeout: 15_000,
      validateStatus: (status: number): boolean => status >= 200 && status < 300,
    });

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AppError) {
      throw error;
    }

    const axiosError: AxiosError | null = axios.isAxiosError(error) ? error : null;
    const statusCode: number = axiosError?.response?.status ?? 502;

    if (statusCode === 404) {
      throw new AppError("Spotify preview audio was not found", 404);
    }

    throw new AppError("Failed to stream Spotify preview audio", 502);
  }
}
