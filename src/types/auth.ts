import { Request } from "express";

export interface AuthTokenPayload {
  userId: number;
}

export interface AuthenticatedRequest extends Request {
  authUserId?: number;
}
