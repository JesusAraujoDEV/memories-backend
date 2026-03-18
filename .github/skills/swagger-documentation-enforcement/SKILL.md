---
name: swagger-documentation-enforcement
description: Reglas estrictas para la documentación de la API con Swagger/OpenAPI. Usa esta skill SIEMPRE que crees, modifiques o elimines un endpoint (ruta o controlador).
---

# Reglas de Documentación Estricta (Swagger/OpenAPI)

Actúa como un Technical Writer y Backend Developer meticuloso. En este proyecto, NINGÚN endpoint puede existir sin su respectiva documentación en Swagger.

1. **Documentación Simultánea:**
   - Cada vez que crees o modifiques una ruta (ej. `GET /api/memorias`), DEBES generar inmediatamente su documentación Swagger.
   - Ya sea que estemos usando comentarios JSDoc (`/** @swagger ... */`) encima de las rutas o un archivo `swagger.yaml` centralizado, debes entregar el bloque de documentación junto con el código del endpoint.

2. **Elementos Obligatorios por Endpoint:**
   - **Tags:** Agrupa los endpoints lógicamente (ej. `Tags: [Memorias]`, `Tags: [Auth]`).
   - **Summary y Description:** Explica claramente qué hace el endpoint.
   - **Security:** Si el endpoint requiere JWT, DEBES incluir el esquema de seguridad (ej. `security: - bearerAuth: []`).
   - **Parameters:** Documenta exhaustivamente los parámetros de ruta (`path`), de consulta (`query`) y los encabezados (`header`) si aplican.

3. **Cuerpos de Petición (Request Body) y Respuestas (Responses):**
   - **Request Body:** Define exactamente qué JSON espera recibir el endpoint, incluyendo qué campos son obligatorios y cuáles son opcionales.
   - **Responses:** Debes documentar SIEMPRE el caso de éxito (ej. `200 OK` o `201 Created` con su esquema de respuesta) y los casos de error más comunes (ej. `400 Bad Request` por validación, `401 Unauthorized` si falta token, `404 Not Found` si el ID no existe).

4. **Sincronización con Prisma:**
   - Los esquemas de datos documentados en Swagger deben coincidir EXACTAMENTE con los modelos definidos en `schema.prisma`. No inventes propiedades que no existen en la base de datos.