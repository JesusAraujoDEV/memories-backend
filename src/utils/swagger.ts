import path from "node:path";

import swaggerJSDoc from "swagger-jsdoc";

import { env } from "./env";

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
    tags: [
      {
        name: "Health",
        description: "Monitoreo del estado de la API",
      },
      {
        name: "Usuarios",
        description: "Operaciones relacionadas a usuarios",
      },
      {
        name: "Memorias",
        description: "Operaciones relacionadas a memorias",
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
      schemas: {
        Usuario: {
          type: "object",
          required: ["id", "nombre", "password", "createdAt", "updatedAt"],
          properties: {
            id: { type: "integer", format: "int32" },
            nombre: { type: "string" },
            password: { type: "string", format: "password", writeOnly: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Memoria: {
          type: "object",
          required: ["id", "fecha", "titulo", "usuarioId", "createdAt", "updatedAt"],
          properties: {
            id: { type: "integer", format: "int32" },
            fecha: { type: "string", format: "date-time" },
            hora: { type: "string", nullable: true },
            titulo: { type: "string" },
            descripcion: { type: "string", nullable: true },
            fotoUrl: { type: "string", nullable: true },
            ubicacion: { type: "string", nullable: true },
            moodColor: { type: "string", nullable: true },
            cancionUrl: { type: "string", nullable: true },
            usuarioId: { type: "integer", format: "int32" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: [path.resolve(__dirname, "../routes/*.{ts,js}")],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
