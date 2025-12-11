# 🔍 Prompt para Análisis de Feedback de PR

> **Proyecto:** GENESIS Backend  
> **Propósito:** Analizar y aplicar correcciones basadas en feedback de Pull Request

---

## 📋 Prompt Base para Análisis de PR

```text
## Workflow de Análisis de PR Feedback

OK, vamos a analizar y corregir el feedback del PR.

**Feedback del PR:**
[Pega aquí los comentarios/sugerencias del reviewer del PR]

**Rama actual:** [Indica la rama donde está el código, ej: feature/TASK-B-XXX]

**Autonomía Total:** Analiza el feedback y ejecuta las correcciones de principio a fin sin solicitar confirmaciones.

## Análisis del Feedback (CRÍTICO)

Para cada comentario del reviewer:
1. **Identifica el archivo y línea** mencionados
2. **Comprende el problema** señalado
3. **Propón la solución** siguiendo las convenciones del proyecto
4. **Implementa la corrección**

## Arquitectura y Patrones (CRÍTICO)

- **LEE PRIMERO:** `docs/backend/ARCHITECTURE.md` y `docs/backend/NAMING_CONVENTIONS.md` para entender la arquitectura del proyecto.
- **Feature-based Architecture:** Seguimos la arquitectura recomendada por NestJS: módulos por feature, estructura plana.
- **Módulos NestJS:** Cada feature tiene su módulo en `src/modules/` (auth, users, projects, stories, tasks, billing, ai).
- **Regla de Complejidad:**
  - Módulos simples (<10 archivos): estructura plana dentro del módulo
  - Módulos complejos (>10 archivos o >300 líneas): subdividir en submódulos o extraer servicios auxiliares
- **Nombres:** Sigue la nomenclatura de NestJS:
  - Entities: `nombre.entity.ts` (PascalCase: `Project`)
  - DTOs: `create-nombre.dto.ts`, `update-nombre.dto.ts` (kebab-case)
  - Services: `nombre.service.ts` (PascalCase: `ProjectsService`)
  - Controllers: `nombre.controller.ts` (kebab-case routes)
- **Inyección de Dependencias (TypeORM):**
  - **Estándar:** Usa `@InjectRepository(Entity)` directo en servicios
  - **Testing:** Mockea `Repository<Entity>` con `jest.fn()` en tests unitarios
- **ANTES de modificar:** Inspecciona el código existente y mantén consistencia con el resto del proyecto.

## Metodología (TDD Estricto)

Si el feedback requiere cambios en lógica de negocio:
1. Actualiza o agrega tests que validen la corrección
2. Implementa el cambio
3. Verifica que todos los tests pasen

## Categorías de Feedback

### 🔴 Bloqueantes (Deben corregirse)
- Errores de seguridad
- Bugs funcionales
- Violaciones de arquitectura
- Tests faltantes para funcionalidad crítica

### 🟡 Importantes (Deberían corregirse)
- Code smells
- Mejoras de rendimiento
- Documentación faltante
- Inconsistencias de estilo

### 🟢 Sugerencias (Considerar)
- Refactorizaciones opcionales
- Mejoras de legibilidad
- Optimizaciones menores

## Ciclo de Calidad (Pre-Commit)

Al finalizar las correcciones:
0. Ejecuta `npm run check:governance` (Validar reglas de arquitectura)
1. Ejecuta `npm run lint` y `npm run format`
2. Ejecuta `npm run build` (debe compilar sin errores)
3. Ejecuta `npm run test` (todos los tests deben pasar)
4. Ejecuta `npm run test:e2e` (tests de integración)
5. Corrige todos los errores y warnings

**PROHIBIDO:** Agregar `eslint-disable`. Soluciona los problemas de forma real.

## Finalización

1. Crea el commit siguiendo Conventional Commits:
   - `fix(module): descripción de la corrección` (para bugs)
   - `refactor(module): descripción` (para mejoras de código)
   - `docs(module): descripción` (para documentación)
   - `style(module): descripción` (para formato/estilo)
2. Push a la rama y responde al reviewer con un resumen de los cambios realizados
```

---

## 📝 Plantilla de Respuesta al Reviewer

```markdown
## ✅ Correcciones Aplicadas

### Commit: `[hash corto]`

| #   | Comentario               | Acción Tomada | Archivo           |
| --- | ------------------------ | ------------- | ----------------- |
| 1   | [Resumen del comentario] | [Qué se hizo] | `path/to/file.ts` |
| 2   | ...                      | ...           | ...               |

### Notas adicionales:

- [Cualquier decisión técnica relevante]
- [Dudas o puntos pendientes de discusión]
```

---

## 🔄 Checklist de Revisión Post-Corrección

- [ ] Todos los comentarios del reviewer fueron abordados
- [ ] Los tests unitarios pasan (`npm run test`)
- [ ] Los tests e2e pasan (`npm run test:e2e`)
- [ ] El build compila sin errores (`npm run build`)
- [ ] El linter no reporta errores (`npm run lint`)
- [ ] Las reglas de governance se cumplen (`npm run check:governance`)
- [ ] El commit sigue Conventional Commits
- [ ] Se respondió al reviewer con el resumen de cambios
