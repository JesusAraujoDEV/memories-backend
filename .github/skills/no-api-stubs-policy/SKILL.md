---
name: no-api-stubs-policy
description: Política estricta contra código incompleto, stubs o placeholders. Usa esta skill SIEMPRE que programes controladores, servicios o lógica de base de datos.
---

# Política de Cero Stubs (No Placeholders)

1. **Prohibición de "Not Implemented":**
   - NUNCA devuelvas respuestas HTTP `501 Not Implemented`.
   - NUNCA dejes un controlador vacío con un mensaje tipo "Lógica pendiente" o "Aquí va el código de Prisma".
   - Si se te pide un endpoint (ej. `getMemoriasByMonth`), DEBES escribir la consulta real a la base de datos, el tipado de los parámetros y la respuesta completa.

2. **Validación y Lógica Real:**
   - Si una función necesita validar un parámetro (ej. verificar que `month` y `year` sean números válidos), escribe la validación completa.
   - Si requiere interactuar con Prisma, escribe el `prisma.memoria.findMany(...)` con sus respectivos filtros (`where`, `include`, etc.).

3. **Ejecución Proactiva:**
   - No me preguntes "Si quieres lo implemento ahora". TÚ DEBES implementarlo inmediatamente en tu primera respuesta. Tu objetivo es entregar código listo para ser ejecutado y probado.