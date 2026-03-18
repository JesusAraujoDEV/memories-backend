import { Router } from "express";

import { healthRouter } from "./health.routes";

export const apiRouter: Router = Router();

apiRouter.use(healthRouter);
