# Reglas de Prevención de Errores (Zero-Friction PWA)

Para asegurar la calidad en la automatización del código y evitar reprocesos durante los despliegues en Easypanel, sigue estrictamente estas reglas:

## 1. Tracking de Git (Archivos Nuevos)
Cualquier archivo o estructura de carpetas nueva que se cree en el proyecto (por ejemplo `src/db/`, `src/actions/`, `src/services/` o nuevas rutas en `src/app/`) debe ser explícitamente añadido al índice de Git (`git add <carpeta>`) antes de hacer el commit. No asumas que los archivos recién creados están siendo trackeados automáticamente. Esto previene los errores "404" en producción por carpetas faltantes.

## 2. Tipado Estricto de TypeScript y Drizzle-Zod
Debido al rigor de Next.js 15 durante el `next build`:
- **Atributos de React:** Nunca utilices propiedades HTML exclusivas de un tag en otro que no le corresponde (ej. `noValidate` es de `<form>`, nunca de `<input>`).
- **Mapeo Drizzle-Zod:** Cuando valides un payload de un Server Action usando un esquema generado por Drizzle-Zod (`createInsertSchema`), mapea explícitamente las variables (ej. `amount.toString()`, `description as string`) antes de enviarlo al servicio de Drizzle. La inferencia automática de Zod y los coerciones numéricas provocan desajustes (`Type error`) con el tipo `$inferInsert` estricto que exige el servicio.

## 3. Prevención antes del Despliegue
Antes de indicar que el código está listo para desplegar, asegúrate de que todas las variables o importaciones creadas correspondan exactamente al contrato de tipos requerido y que no existan atributos inválidos en la estructura del DOM de React.
