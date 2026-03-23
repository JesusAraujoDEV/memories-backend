import path from 'node:path';

import swaggerJsdoc, { Options } from 'swagger-jsdoc';

import { env } from '../utils/env';

const swaggerApiFiles = [
  path.resolve(process.cwd(), 'swagger', 'schemas.yaml'),
  path.resolve(process.cwd(), 'swagger', 'memories.yaml'),
  path.resolve(process.cwd(), 'swagger', '*.yaml'),
  path.resolve(process.cwd(), 'src', 'swagger', '**', '*.yaml'),
];

const servers = [
  { url: env.backendUrl, description: 'Servidor de Produccion' },
  { url: `http://localhost:${env.port}`, description: 'Servidor Local' },
];

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CronoCapsula API',
      version: '1.0.0',
      description: 'Documentacion modular de la API para el diario de memorias',
    },
    servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: swaggerApiFiles,
};

export const swaggerSpec = swaggerJsdoc(options);
