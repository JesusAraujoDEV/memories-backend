---
name: typescript-strict-standards
description: Estándares de calidad de código para TypeScript. Usa esta skill cuando vayas a escribir, editar o revisar cualquier archivo .ts o .tsx.
---

# Estándares Estrictos de TypeScript

1. **Prohibición absoluta del tipo `any`:** - NUNCA uses `any`. Si no conoces el tipo, usa `unknown` y haz type narrowing (validación), o define la `interface`/`type` correspondiente.
   
2. **Tipado Fuerte en Funciones:**
   - Todas las funciones deben tener tipados explícitos para sus parámetros y para su valor de retorno (ej. `async function getUser(id: number): Promise<User>`).

3. **Validación de Datos (DTOs):**
   - Todo lo que entre por el body (`req.body`) DEBE ser validado antes de llegar al Service (usando Zod, Joi, o class-validator). No confíes en que el frontend enviará los datos correctos.

4. **Nomenclatura (Clean Code):**
   - Usa `camelCase` para variables y funciones.
   - Usa `PascalCase` para Clases, Interfaces y Tipos.
   - Nombra las funciones con verbos de acción claros (ej. `findMemoriaById`, `createUsuario`, `calculateStats`).