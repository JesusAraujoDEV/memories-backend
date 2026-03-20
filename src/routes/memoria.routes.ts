import { Router } from "express";

import {
	createMemoria,
	deleteMemoria,
	getMemoriaById,
	getMemoriasByMonth,
	patchMemoria,
} from "../controllers/memoria.controller";
import { authenticateRequest } from "../middlewares/auth.middleware";

export const memoriaRouter: Router = Router();

memoriaRouter.post("/memorias", authenticateRequest, createMemoria);
memoriaRouter.get("/memorias", authenticateRequest, getMemoriasByMonth);
memoriaRouter.get("/memorias/:id", authenticateRequest, getMemoriaById);
memoriaRouter.patch("/memorias/:id", authenticateRequest, patchMemoria);
memoriaRouter.delete("/memorias/:id", authenticateRequest, deleteMemoria);
