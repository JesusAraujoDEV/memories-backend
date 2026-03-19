import { Router } from "express";

import { authRouter } from "./auth.routes";
import { healthRouter } from "./health.routes";
import { memoriaRouter } from "./memoria.routes";
import { uploadRouter } from "./upload.routes";

export const apiRouter: Router = Router();

apiRouter.use(authRouter);
apiRouter.use(healthRouter);
apiRouter.use(memoriaRouter);
apiRouter.use(uploadRouter);
