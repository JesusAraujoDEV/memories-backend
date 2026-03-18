import { Router } from "express";

import { getHealthController } from "../controllers/health.controller";

export const healthRouter: Router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check del servidor
 *     description: Verifica que la API esté activa y respondiendo.
 *     responses:
 *       200:
 *         description: Estado del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Error interno del servidor
 */
healthRouter.get("/health", getHealthController);
