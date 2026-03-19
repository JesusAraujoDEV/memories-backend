import { Router } from "express";

import { uploadMediaFile } from "../controllers/upload.controller";
import { authenticateRequest } from "../middlewares/auth.middleware";
import { uploadSingleFile } from "../middlewares/upload.middleware";

export const uploadRouter: Router = Router();

uploadRouter.post("/upload", authenticateRequest, uploadSingleFile, uploadMediaFile);
