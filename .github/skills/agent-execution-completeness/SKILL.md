---
name: agent-execution-completeness
description: Reglas de comportamiento obligatorio para la ejecución de tareas. Usa esta skill CONSTANTEMENTE para asegurar que el código entregado sea funcional y esté listo para producción.
---

# Reglas de Ejecución Completa

1. **PROHIBIDO DEJAR PLACEHOLDERS:**
   - NUNCA generes respuestas con comentarios perezosos como `// ... resto del código ...`, `// TODO: implementar la lógica aquí`, o `// Añadir validaciones`.
   - Si se te pide una función, escríbela COMPLETA de principio a fin, cubriendo los edge cases (casos borde).

2. **Imports Completos y Precisos:**
   - Si creas un archivo nuevo o usas una función/módulo externo, DEBES incluir las sentencias de `import` necesarias al inicio del archivo.

3. **Cumplimiento Total de Órdenes:**
   - Si el usuario te pide 3 cosas en un prompt, no te detengas en la segunda. Revisa internamente tu lista de tareas y asegúrate de haber respondido a cada punto antes de dar por terminada tu respuesta.
   - Si te falta contexto para terminar una tarea de forma segura, DETENTE y pídele la información exacta al usuario en lugar de adivinar o inventar código ciego.

4. **Sincronización de Documentación:**
   - Si creas un nuevo endpoint, DEBES generar o actualizar inmediatamente el bloque correspondiente para Swagger/OpenAPI.