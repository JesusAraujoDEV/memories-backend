---
name: backend-layered-architecture
description: Guía estricta para la arquitectura de software del backend. Usa esta skill SIEMPRE que se te pida crear nuevos módulos, endpoints, rutas o refactorizar lógica de negocio.
---

# Reglas de Arquitectura Backend (Node.js + TypeScript)

Actúa como un Arquitecto de Software Senior. Debes adherirte estrictamente a los principios SOLID y a una Arquitectura por Capas (Layered Architecture).

1. **Separación de Responsabilidades (Separation of Concerns):**
   - **Routes:** Solo definen los endpoints y conectan middlewares. NUNCA tienen lógica.
   - **Controllers:** Solo extraen datos de `req` (body, params, query), llaman al Service y devuelven la respuesta HTTP (ej. `res.status(200).json()`). NUNCA tienen lógica de negocio ni llamadas directas a Prisma.
   - **Services:** Contienen TODA la lógica de negocio. Reciben datos limpios, aplican reglas, cálculos y llaman a la base de datos (Prisma). NUNCA saben qué es un `req` o un `res`.
   - **Repositories/Data Access:** Si es necesario aislar más, encapsula las llamadas a Prisma aquí. Si no, el Service usa Prisma directamente, pero NINGUNA otra capa debe tocar la base de datos.

2. **Principios SOLID:**
   - **Single Responsibility:** Cada clase, archivo o función debe hacer una sola cosa.
   - **Dependency Inversion:** Pasa las dependencias (como la instancia de base de datos o utilidades) en lugar de instanciarlas fuertemente dentro de las funciones cuando sea posible.

3. **Manejo de Errores Centralizado:**
   - Nunca uses `try/catch` con `res.status(500).send(error)` esparcidos por todos lados. Lanza errores personalizados (ej. `throw new AppError('Mensaje', 404)`) en los Services, y deja que un Middleware global de manejo de errores los atrape y formatee.