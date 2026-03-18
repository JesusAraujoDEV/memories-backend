---
name: swagger-modular-yaml
description: Reglas estrictas para la arquitectura y modularización de la documentación Swagger/OpenAPI. Usa esta skill cuando documentes cualquier endpoint.
---

# Arquitectura Modular de Swagger (OpenAPI)

1. **Prohibición de Swagger Inline:**
   - NUNCA uses comentarios JSDoc (`/** @swagger ... */`) en los controladores o rutas para documentar. Ensucia el código.
   - NUNCA generes un único archivo `swagger.json` o `swagger.yaml` monolítico gigante.

2. **Estructura de Carpetas Obligatoria:**
   - Toda la documentación debe vivir en una carpeta dedicada, por ejemplo: `src/docs/swagger/` o `swagger/` en la raíz.
   - Debes crear un archivo `.yaml` separado por cada dominio o recurso (ej. `users.yaml`, `memories.yaml`, `auth.yaml`).

3. **Configuración del Entrypoint:**
   - Cuando configures `swagger-ui-express`, debes indicar cómo leer y unificar estos archivos YAML múltiples (usualmente usando librerías como `yamljs` o configurando `swagger-jsdoc` para que lea un patrón de archivos como `apis: ['./swagger/*.yaml']`).

4. **Contenido del YAML:**
   - Cada archivo YAML debe contener correctamente las rutas (`paths`), los parámetros, los cuerpos de petición (`requestBody`), y las respuestas (`responses`).
   - Define los esquemas (`components/schemas`) dentro del mismo YAML del dominio o en un `schemas.yaml` global.