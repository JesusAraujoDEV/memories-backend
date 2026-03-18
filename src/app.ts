import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";

import { corsMiddleware } from "./middlewares/cors.middleware";
import { errorHandlerMiddleware, notFoundMiddleware } from "./middlewares/errorHandler.middleware";
import { apiRouter } from "./routes";
import { swaggerSpec } from "./utils/swagger";

const app: Application = express();

app.disable("x-powered-by");
app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
