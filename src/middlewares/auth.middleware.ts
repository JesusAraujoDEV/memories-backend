import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { AuthTokenPayload, AuthenticatedRequest } from "../types/auth";
import { AppError } from "../utils/appError";
import { env } from "../utils/env";

function readBearerToken(authorizationHeader: string | undefined): string {
  if (!authorizationHeader) {
    throw new AppError("Authorization header is required", 401);
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Authorization header must use Bearer token", 401);
  }

  return token;
}

function parseTokenPayload(decodedToken: string | JwtPayload): AuthTokenPayload {
  if (typeof decodedToken === "string") {
    throw new AppError("Invalid token payload", 401);
  }

  const userIdCandidate: unknown = decodedToken.userId;

  if (typeof userIdCandidate !== "number" || !Number.isInteger(userIdCandidate) || userIdCandidate <= 0) {
    throw new AppError("Invalid token payload", 401);
  }

  return {
    userId: userIdCandidate,
  };
}

export function authenticateRequest(req: Request, _res: Response, next: NextFunction): void {
  const typedRequest: AuthenticatedRequest = req;
  const token: string = readBearerToken(req.headers.authorization);

  let decodedToken: string | JwtPayload;

  try {
    decodedToken = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }

  const payload: AuthTokenPayload = parseTokenPayload(decodedToken);
  typedRequest.authUserId = payload.userId;

  next();
}
