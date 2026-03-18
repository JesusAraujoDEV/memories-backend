import { Router } from "express";

import { login, register } from "../controllers/auth.controller";

export const authRouter: Router = Router();

authRouter.post("/auth/register", register);
authRouter.post("/auth/login", login);
