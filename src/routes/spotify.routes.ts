import { Router } from "express";

import { spotifyProxy, spotifySearch } from "../controllers/spotify.controller";
import { authenticateRequest } from "../middlewares/auth.middleware";

export const spotifyRouter: Router = Router();

spotifyRouter.get("/spotify/search", authenticateRequest, spotifySearch);
spotifyRouter.get("/spotify/proxy", authenticateRequest, spotifyProxy);
