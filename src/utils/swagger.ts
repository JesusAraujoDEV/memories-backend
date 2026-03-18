import path from "node:path";

import swaggerJSDoc from "swagger-jsdoc";

import { env } from "./env";

const swaggerFilesPattern: string = path.resolve(process.cwd(), "swagger", "*.yaml");

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "CronoCapsula API",
      version: "1.0.0",
      description: "API base para diario digital de memorias tipo calendario.",
    },
    servers: [
      {
        url: env.backendUrl,
        description: "Servidor principal",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [swaggerFilesPattern],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
