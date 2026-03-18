---
name: prisma-database-design
description: Reglas estrictas para el diseño de la base de datos y el uso del ORM Prisma. Usa esta skill cuando vayas a modificar el archivo schema.prisma o escribir consultas de base de datos.
---

# Reglas de Diseño de Base de Datos (Prisma)

1. **Nomenclatura Estricta (Convenciones):**
   - Los nombres de los Modelos (Tablas) DEBEN estar en singular y en `PascalCase` (ej. `model Memoria`, `model Usuario`).
   - Los campos de las tablas DEBEN estar en `camelCase` (ej. `fotoUrl`, `notaVozUrl`).
   - Evita abreviaturas confusas. Usa nombres descriptivos.

2. **Campos de Auditoría Obligatorios:**
   - TODO modelo debe tener su llave primaria: `id Int @id @default(autoincrement())` o `id String @id @default(uuid())`.
   - TODO modelo debe incluir los campos de rastro de tiempo: 
     `createdAt DateTime @default(now())`
     `updatedAt DateTime @updatedAt`

3. **Relaciones Claras:**
   - Al definir relaciones entre tablas (1:N o N:M), asegúrate de definir explícitamente los campos relacionales y de referencia (ej. `@relation(fields: [usuarioId], references: [id])`).
   - Si se borra un registro padre, define claramente qué pasa con los hijos (ej. `onDelete: Cascade` si aplica).