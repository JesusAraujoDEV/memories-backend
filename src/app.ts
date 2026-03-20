import express, { Application } from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import { swaggerSpec } from "./config/swagger";
import { corsMiddleware } from "./middlewares/cors.middleware";
import { errorHandlerMiddleware, notFoundMiddleware } from "./middlewares/errorHandler.middleware";
import { apiRouter } from "./routes";

const app: Application = express();

app.disable("x-powered-by");
app.disable("etag");
app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use((req, _res, next) => {
	if (req.body && typeof req.body === "object" && Object.keys(req.body).length > 0) {
		console.log(`[BODY] [${req.method}] ${req.url}:`, JSON.stringify(req.body, null, 2));
	}

	next();
});
app.use(morgan("dev"));

// Desactivar cache y forzar a los clientes a pedir datos frescos.
app.use((req, res, next) => {
	res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
	res.set("Pragma", "no-cache");
	res.set("Expires", "0");
	res.set("Surrogate-Control", "no-store");
	next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", apiRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export { app };
