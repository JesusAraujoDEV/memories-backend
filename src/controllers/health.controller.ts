import { Request, Response } from "express";

import { HealthStatus, getHealthStatus } from "../services/health.service";

export function getHealthController(_req: Request, res: Response): void {
  const healthStatus: HealthStatus = getHealthStatus();
  res.status(200).json(healthStatus);
}
