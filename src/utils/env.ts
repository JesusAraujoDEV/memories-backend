import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  databaseUrl: string;
  backendUrl: string;
  port: number;
  jwtSecret: string;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  whitelistUrls: string[];
}

function getRequiredEnv(variableName: string): string {
  const value: string | undefined = process.env[variableName];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }

  return value;
}

function parsePort(portValue: string): number {
  const parsedPort: number = Number(portValue);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0 || parsedPort > 65535) {
    throw new Error("PORT must be a valid integer between 1 and 65535");
  }

  return parsedPort;
}

function parseWhitelist(rawWhitelist: string): string[] {
  const whitelist: string[] = rawWhitelist
    .split(",")
    .map((origin: string) => origin.trim())
    .filter((origin: string) => origin.length > 0);

  if (whitelist.length === 0) {
    throw new Error("WHITELIST_URLS must contain at least one origin");
  }

  return whitelist;
}

export const env: EnvConfig = {
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  backendUrl: getRequiredEnv("BACKEND_URL"),
  port: parsePort(getRequiredEnv("PORT")),
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  cloudinaryCloudName: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: getRequiredEnv("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: getRequiredEnv("CLOUDINARY_API_SECRET"),
  whitelistUrls: parseWhitelist(getRequiredEnv("WHITELIST_URLS")),
};
