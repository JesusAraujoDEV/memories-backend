import cors, { CorsOptions } from "cors";

import { env } from "../utils/env";

const allowedOrigins: Set<string> = new Set(env.whitelistUrls);

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin not allowed by CORS: ${origin}`));
  },
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
