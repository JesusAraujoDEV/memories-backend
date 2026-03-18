import swaggerJsdoc, { Options } from 'swagger-jsdoc';

import { env } from '../utils/env';

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
  apis: ['./src/swagger/**/*.yaml', './swagger/**/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);
