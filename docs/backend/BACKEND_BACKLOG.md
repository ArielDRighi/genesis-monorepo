# 🔧 BACKEND BACKLOG - GENESIS MVP

> **Generado por:** GENESIS v1.0  
> **Fecha:** 2024-12-10  
> **Stack:** NestJS 10.x + PostgreSQL + TypeORM  
> **Arquitectura:** Feature-based (NestJS Modular)  
> **Metodología:** TDD

---

## 📋 Prompt Base para Ejecución de Tareas

```text
## Workflow de Ejecución

OK, vamos a iniciar esta nueva tarea del backend.

Tarea: TASK-X.Y: [Pega aquí la descripción detallada de la tarea del BACKEND_BACKLOG.md]

**Autonomía Total:** Ejecuta la tarea de principio a fin sin solicitar confirmaciones.

**Rama:** Estás en `develop`. Crea la rama `feature/TASK-B-XXX-descripcion` (usa nomenclatura gitflow) y trabaja en ella.

## Arquitectura y Patrones (CRÍTICO)

- **LEE PRIMERO:** `docs/backend/ARCHITECTURE.md` y `docs/backend/AI_DEVELOPMENT_GUIDE.md` para entender la arquitectura del proyecto.
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
- **ANTES de crear:** Inspecciona módulos existentes similares y replica su estructura exacta.

## Metodología (TDD Estricto)

Sigue un ciclo TDD riguroso:
1. Escribe un test (debe fallar)
2. Escribe el código mínimo para que el test pase
3. Refactoriza

## Ciclo de Calidad (Pre-Commit)

Al finalizar la implementación:
0. Ejecuta `npm run check:governance` (Validar reglas de arquitectura)
1. Ejecuta `npm run lint` y `npm run format`
2. Ejecuta `npm run build` (debe compilar sin errores)
3. Ejecuta `npm run test` (todos los tests deben pasar)
4. Ejecuta `npm run test:e2e` (tests de integración)
5. Corrige todos los errores y warnings

**PROHIBIDO:** Agregar `eslint-disable`. Soluciona los problemas de forma real.

## Finalización

1. Actualiza este documento marcando la tarea como ✅ COMPLETADO
2. Crea el commit siguiendo Conventional Commits: `feat(module): descripción`
3. Push a la rama y crea PR hacia `develop`
```

---

## 🏗️ FASE 0: Configuración del Entorno

---

### **TASK-B-001: Inicialización del Monorepo y Proyecto NestJS** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** Ninguna  
**Estado:** ✅ COMPLETADA  
**HU Relacionada:** Configuración Inicial  
**Marcador MVP:** ⭐⭐ **FUNDACIONAL**

#### 📋 Descripción

Crear un **monorepo** que contendrá tanto el backend (NestJS) como el frontend (Next.js). Esta estructura permite compartir contexto entre ambos proyectos y facilita el desarrollo. Configurar el backend con arquitectura feature-based de NestJS, TypeScript en modo estricto y path aliases.

#### 🧪 Testing

**Tests necesarios:**

- [x] **Tests unitarios:**
  - La aplicación inicia correctamente (`app.listen`)
  - Los path aliases resuelven correctamente
  - El health check endpoint responde 200

**Ubicación:** `src/app.controller.spec.ts`, `test/app.e2e-spec.ts`

#### ✅ Tareas específicas

- [x] Crear estructura de monorepo:
  ```
  genesis/
  ├── apps/
  │   ├── backend/    ← NestJS (este backlog)
  │   └── frontend/   ← Next.js (frontend backlog)
  ├── packages/       ← Código compartido (opcional, futuro)
  ├── package.json    ← Root con workspaces
  ├── turbo.json      ← Configuración de Turborepo (opcional)
  └── .gitignore
  ```
- [x] Configurar npm/pnpm workspaces en `package.json` raíz
- [x] Crear proyecto NestJS en `apps/backend` con `nest new . --strict`
- [x] Configurar TypeScript con modo estricto (`strict: true`, `noImplicitAny: true`)
- [x] Configurar path aliases en `tsconfig.json`:
  - `@modules/*` → `src/modules/*`
  - `@common/*` → `src/common/*`
  - `@config/*` → `src/config/*`
- [x] Crear estructura de carpetas feature-based (NestJS standard):
  - `src/modules/` - Un módulo por feature: auth, users, projects, stories, tasks, billing, ai
    - Cada módulo contiene: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `entities/`
  - `src/common/` - Código compartido: guards, filters, interceptors, decorators, pipes
  - `src/config/` - Archivos de configuración
  - `src/database/` - Migraciones y seeds
- [x] Configurar scripts en `package.json` del backend (start:dev, build, test, test:e2e, migration:\*)
- [x] Crear endpoint health check GET `/health`

#### 🎯 Criterios de aceptación

- [x] Monorepo configurado con workspaces funcionales
- [x] `npm run start:dev` desde `apps/backend` levanta el servidor sin errores
- [x] `npm run build` compila sin errores ni warnings
- [x] Path aliases funcionan en imports
- [x] GET `/health` retorna `{ status: 'ok' }`
- [x] Estructura lista para agregar frontend en `apps/frontend`

---

### **TASK-B-002: Configuración de PostgreSQL con Docker y TypeORM** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-001  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** Configuración Inicial  
**Marcador MVP:** ⭐⭐ **FUNDACIONAL**

#### 📋 Descripción

Configurar PostgreSQL en Docker para desarrollo local, integrar TypeORM, crear la entidad base `User` con todos los campos necesarios para el sistema de cuotas y planes, y establecer el sistema de migraciones.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Conexión a base de datos exitosa
  - Entidad User se crea correctamente con todos los campos
  - Migración se ejecuta sin errores

**Ubicación:** `src/modules/users/entities/user.entity.spec.ts`

#### ✅ Tareas específicas

- [ ] Crear `docker-compose.yml` en raíz del monorepo con servicio PostgreSQL:
  - Imagen: `postgres:16-alpine`
  - Puerto: `5432:5432`
  - Volume para persistencia: `genesis_postgres_data`
  - Variables: `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- [ ] Agregar scripts en `package.json` raíz:
  - `db:up` → `docker-compose up -d postgres`
  - `db:down` → `docker-compose down`
  - `db:logs` → `docker-compose logs -f postgres`
- [ ] Instalar dependencias: `@nestjs/typeorm`, `typeorm`, `pg`, `@nestjs/config`
- [ ] Crear `src/config/database.config.ts` con configuración desde variables de entorno
- [ ] Configurar `TypeOrmModule.forRootAsync()` en `app.module.ts`
- [ ] Crear entidad `User` con campos:
  - `id` (UUID, primary)
  - `email` (string, unique)
  - `password` (string, hashed)
  - `plan` (enum: FREE, BASIC, PRO, default FREE)
  - `projects_count` (integer, default 0)
  - `free_project_used` (boolean, default false)
  - `tasks_count` (integer, default 0)
  - `quota_reset_date` (timestamp, nullable)
  - `has_completed_onboarding` (boolean, default false)
  - `created_at`, `updated_at` (timestamps)
- [ ] Crear archivo `data-source.ts` para CLI de TypeORM
- [ ] Generar migración inicial con la tabla `users`
- [ ] Crear archivo `.env.example` con variables de base de datos

#### 🎯 Criterios de aceptación

- [ ] `npm run db:up` levanta PostgreSQL en Docker
- [ ] `npm run migration:run` ejecuta sin errores
- [ ] Tabla `users` existe en PostgreSQL con todos los campos
- [ ] La aplicación conecta a la BD al iniciar
- [ ] `.env.example` documenta todas las variables requeridas

---

### **TASK-B-003: Sistema de Autenticación JWT** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 4 horas  
**Dependencias:** TASK-B-002  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-01 - Registro y Autenticación JWT Nativa  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar autenticación JWT nativa con registro, login y protección de rutas. Las contraseñas deben hashearse con bcrypt. Al registrar, asignar automáticamente plan FREE e inicializar contadores de cuota.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Registro exitoso crea usuario con plan FREE
  - Registro falla si email ya existe (409 Conflict)
  - Registro falla si password < 8 caracteres (400)
  - Login exitoso retorna token JWT válido
  - Login falla con credenciales inválidas (401)
  - Password se hashea con bcrypt (nunca guardado en plano)
- [ ] **Tests e2e:**
  - POST `/auth/register` → 201 con token
  - POST `/auth/login` → 200 con token
  - GET `/auth/profile` sin token → 401
  - GET `/auth/profile` con token → 200 con datos del usuario

**Ubicación:** `src/modules/auth/auth.service.spec.ts`, `test/auth.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Instalar: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcrypt`
- [ ] Crear módulo `auth` con estructura:
  - `auth.module.ts`
  - `auth.controller.ts`
  - `auth.service.ts`
  - `dto/register.dto.ts`, `dto/login.dto.ts`
  - `guards/jwt-auth.guard.ts`
  - `strategies/jwt.strategy.ts`
  - `decorators/current-user.decorator.ts`
- [ ] Implementar endpoint POST `/auth/register`:
  - Validar email único y password ≥ 8 caracteres
  - Hashear password con bcrypt (10 rounds)
  - Crear usuario con `plan: FREE`, `projects_count: 0`, `free_project_used: false`
  - Retornar token JWT y datos del usuario (sin password)
- [ ] Implementar endpoint POST `/auth/login`:
  - Validar credenciales
  - Retornar token JWT y datos del usuario
- [ ] Implementar endpoint GET `/auth/profile` (protegido):
  - Retornar datos del usuario autenticado
- [ ] Configurar JWT con expiración de 7 días
- [ ] Crear decorador `@CurrentUser()` para obtener usuario en controllers

#### 🎯 Criterios de aceptación

- [ ] Registro crea usuario con plan FREE automáticamente
- [ ] Passwords nunca se guardan en texto plano
- [ ] Token JWT válido por 7 días
- [ ] Rutas protegidas rechazan requests sin token válido
- [ ] Todos los tests pasan con coverage >80%

---

### **TASK-B-004: Integración con GitHub y CI/CD** ⭐

**Prioridad:** 🟡 MEDIA  
**Estimación:** 2 horas  
**Dependencias:** TASK-B-001  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** Configuración Inicial  
**Marcador MVP:** ⭐ **RECOMENDADO**

#### 📋 Descripción

Configurar repositorio GitHub con GitHub Actions para CI (lint, test, build). Crear documentación inicial del proyecto y guías de contribución.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests de CI:**
  - Pipeline ejecuta lint sin errores
  - Pipeline ejecuta tests sin errores
  - Pipeline compila el proyecto sin errores

**Ubicación:** `.github/workflows/ci.yml`

#### ✅ Tareas específicas

- [ ] Crear `.gitignore` completo para NestJS
- [ ] Crear `.github/workflows/ci.yml` con jobs:
  - Checkout código
  - Setup Node.js 20
  - Install dependencies
  - Run lint
  - Run tests con PostgreSQL service
  - Run build
- [ ] Crear `README.md` con:
  - Descripción del proyecto
  - Requisitos (Node 20+, PostgreSQL 15+)
  - Instrucciones de instalación
  - Variables de entorno
  - Comandos disponibles
- [ ] Crear `CONTRIBUTING.md` con guía de ramas (gitflow)
- [ ] Verificar ESLint y Prettier configurados correctamente

#### 🎯 Criterios de aceptación

- [ ] Push a `develop` ejecuta pipeline de CI
- [ ] Pipeline pasa completamente (lint + test + build)
- [ ] README documenta setup completo del proyecto
- [ ] CONTRIBUTING explica flujo de trabajo con ramas

---

### **TASK-B-005: Sistema de Configuración y Variables de Entorno** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 1.5 horas  
**Dependencias:** TASK-B-002  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** Configuración Inicial  
**Marcador MVP:** ⭐⭐ **FUNDACIONAL**

#### 📋 Descripción

Implementar validación estricta de variables de entorno con Joi. La aplicación NO debe iniciar si faltan variables requeridas. Crear configuración tipada para acceso seguro.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - App falla al iniciar sin `JWT_SECRET`
  - App falla al iniciar sin variables de DB
  - App inicia correctamente con todas las variables
  - ConfigService retorna valores tipados correctamente

**Ubicación:** `src/config/configuration.spec.ts`

#### ✅ Tareas específicas

- [ ] Instalar `joi` para validación de schema
- [ ] Crear `src/config/env.validation.ts` con schema Joi:
  - `NODE_ENV`: development | production | test
  - `PORT`: número, default 3000
  - `DATABASE_*`: host, port, user, password, name (requeridos)
  - `JWT_SECRET`: string mínimo 32 caracteres (requerido)
  - `JWT_EXPIRATION`: string, default '7d'
  - `ANTHROPIC_API_KEY`: string (opcional en desarrollo)
  - `STRIPE_*`: keys de Stripe (opcionales)
  - `FRONTEND_URL`: URL para CORS
- [ ] Crear `src/config/configuration.ts` con interfaces TypeScript
- [ ] Configurar `ConfigModule.forRoot()` con validación
- [ ] Crear `.env.example` completo y documentado
- [ ] Verificar que la app falla con mensaje claro si faltan variables

#### 🎯 Criterios de aceptación

- [ ] App no inicia sin variables requeridas
- [ ] Mensaje de error indica qué variable falta
- [ ] `.env.example` documenta todas las variables con descripciones
- [ ] ConfigService tiene tipos correctos (no `any`)

---

## 📊 Resumen de Progreso - Fase 0

| Task ID    | Título                               | Prioridad  | Estado       | Estimación |
| ---------- | ------------------------------------ | ---------- | ------------ | ---------- |
| TASK-B-001 | Inicialización Monorepo + NestJS     | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-002 | PostgreSQL (Docker) + TypeORM        | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-003 | Autenticación JWT                    | 🔴 CRÍTICA | 🔲 PENDIENTE | 4h         |
| TASK-B-004 | GitHub + CI/CD                       | 🟡 MEDIA   | 🔲 PENDIENTE | 2h         |
| TASK-B-005 | Configuración y Variables de Entorno | 🔴 CRÍTICA | 🔲 PENDIENTE | 1.5h       |

**Total Fase 0:** 13.5 horas estimadas

---

## 🏛️ FASE 1: Módulos Core

---

### **TASK-B-006: Módulo de Usuarios con Sistema de Planes** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-002, TASK-B-003  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-13 - Gestión de Planes y Validación de Cuotas  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear módulo `users` completo con endpoints CRUD y lógica de planes. Implementar enum de planes (FREE, BASIC, PRO), campos de cuota y servicio para consultar/actualizar estado del usuario.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - `getUserById` retorna usuario con todos los campos de plan
  - `updatePlan` actualiza correctamente el plan y fecha de renovación
  - Usuario FREE tiene `free_project_used` inicializado en false
  - Enum de planes solo acepta valores válidos
- [ ] **Tests e2e:**
  - GET `/users/me` retorna datos del usuario autenticado con info de plan
  - PATCH `/users/me` permite actualizar campos permitidos

**Ubicación:** `src/modules/users/users.service.spec.ts`, `test/users.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear módulo `users` con estructura feature-based
- [ ] Completar entidad `User` con campos de cuota:
  - `plan` (enum: FREE, BASIC, PRO)
  - `projects_count`, `tasks_count` (integers)
  - `free_project_used` (boolean)
  - `quota_reset_date` (timestamp nullable)
- [ ] Crear DTOs: `user-response.dto.ts`, `update-user.dto.ts`
- [ ] Implementar `UsersService` con métodos: `findById`, `findByEmail`, `updatePlan`, `incrementProjectCount`
- [ ] Implementar endpoint GET `/users/me` (datos del usuario autenticado)
- [ ] Implementar endpoint PATCH `/users/me` (actualizar perfil)
- [ ] Excluir `password` de todas las respuestas usando `class-transformer`

#### 🎯 Criterios de aceptación

- [ ] Endpoint `/users/me` retorna usuario sin password
- [ ] Campos de plan y cuota se inicializan correctamente al crear usuario
- [ ] Todos los tests pasan con coverage >80%

---

### **TASK-B-007: Guard de Validación de Cuotas** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-006  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-13 - Gestión de Planes y Validación de Cuotas  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar `QuotaGuard` que valide límites de uso antes de operaciones críticas. Usuarios FREE: 1 proyecto único (no renovable), máximo 20 tareas. Usuarios de pago: límite de proyectos según plan, sin límite de tareas.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Usuario FREE con `free_project_used=false` puede crear proyecto
  - Usuario FREE con `free_project_used=true` recibe 403
  - Usuario FREE con 20 tareas recibe 403 al crear más
  - Usuario BASIC con 5 proyectos recibe 403
  - Usuario PRO con 20 proyectos recibe 403
  - Usuarios de pago sin límite de tareas
- [ ] **Tests e2e:**
  - Request bloqueado retorna `{ error: 'QUOTA_EXCEEDED', upgradeUrl: '/billing' }`

**Ubicación:** `src/common/guards/quota.guard.spec.ts`

#### ✅ Tareas específicas

- [ ] Crear `src/common/guards/quota.guard.ts` como Guard de NestJS
- [ ] Implementar lógica de validación para cada tipo de operación:
  - `CREATE_PROJECT`: verificar límite de proyectos según plan
  - `CREATE_TASK`: verificar límite de 20 tareas solo para FREE
  - `GENERATE_AI`: verificar que usuario puede usar IA
- [ ] Crear decorador `@CheckQuota(operationType)` para aplicar a endpoints
- [ ] Crear constantes con límites por plan en `src/common/constants/plans.ts`
- [ ] Implementar respuesta de error estandarizada con `upgradeUrl`
- [ ] Documentar uso del guard en README del módulo

#### 🎯 Criterios de aceptación

- [ ] Guard bloquea correctamente usuarios que exceden cuota
- [ ] Respuesta incluye `error`, `message` y `upgradeUrl`
- [ ] Guard es reutilizable con decorador `@CheckQuota()`
- [ ] Tests cubren todos los escenarios de planes

---

### **TASK-B-008: Rate Limiting con PostgreSQL** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-006  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-13B - Rate Limiting y Control de Abuso  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar rate limiting usando PostgreSQL para controlar frecuencia de llamadas a endpoints de IA. Límites: 5 proyectos/día (planes pago), 3 regeneraciones de análisis/hora, 3 regeneraciones de historias/hora, 2 regeneraciones de tareas/hora.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Primera request incrementa contador a 1
  - Request excediendo límite retorna 429
  - Contador se resetea después del TTL
  - Headers `X-RateLimit-*` incluidos en respuesta
- [ ] **Tests e2e:**
  - 6ta request de creación de proyecto en un día retorna 429
  - Response incluye `retryAfter` con segundos restantes

**Ubicación:** `src/common/guards/rate-limit.guard.spec.ts`

#### ✅ Tareas específicas

- [ ] Crear tabla `rate_limits` con columnas: `user_id`, `action`, `count`, `window_start`, `expires_at`
- [ ] Crear migración para la tabla
- [ ] Implementar `RateLimitService` con métodos: `checkLimit`, `incrementCount`, `getRemainingQuota`
- [ ] Crear `RateLimitGuard` que use el servicio
- [ ] Crear decorador `@RateLimit(action, limit, windowSeconds)`
- [ ] Implementar cleanup de registros expirados (job programado o trigger)
- [ ] Agregar headers de rate limit a respuestas: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

#### 🎯 Criterios de aceptación

- [ ] Rate limiting funciona correctamente por usuario y acción
- [ ] Respuesta 429 incluye `retryAfter` con tiempo de espera
- [ ] Headers de rate limit presentes en todas las respuestas
- [ ] Registros expirados se limpian automáticamente

---

### **TASK-B-009: Módulo de Proyectos (CRUD Básico)** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 4 horas  
**Dependencias:** TASK-B-006, TASK-B-007  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-02 - Dashboard de Proyectos, HU-04 - Definición del Proyecto  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear módulo `projects` con entidad completa y endpoints CRUD. Incluir campos para stack tecnológico, metodología y tipo de arquitectura. Integrar `QuotaGuard` en endpoint de creación.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Crear proyecto incrementa `projects_count` del usuario
  - Usuario FREE marca `free_project_used=true` al crear
  - Listar proyectos solo retorna proyectos del usuario autenticado
  - Actualizar proyecto preserva campos no enviados
  - Eliminar proyecto (soft delete) marca `deleted_at`
- [ ] **Tests e2e:**
  - POST `/projects` crea proyecto y retorna 201
  - GET `/projects` lista proyectos del usuario
  - GET `/projects/:id` retorna 404 si no es dueño
  - DELETE `/projects/:id` retorna 204

**Ubicación:** `src/modules/projects/projects.service.spec.ts`, `test/projects.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear módulo `projects` con estructura feature-based
- [ ] Crear entidad `Project` con campos:
  - `id`, `user_id`, `name`, `idea_description`
  - `stack_backend`, `stack_frontend`, `database`
  - `methodology`, `architecture_type`, `architecture_custom`
  - `analysis_result`, `status` (enum: DRAFT, IN_PROGRESS, COMPLETED)
  - `tasks_count`, `created_at`, `updated_at`, `deleted_at`
- [ ] Crear DTOs: `create-project.dto.ts`, `update-project.dto.ts`, `project-response.dto.ts`
- [ ] Implementar `ProjectsService` con métodos CRUD
- [ ] Aplicar `@CheckQuota('CREATE_PROJECT')` en endpoint POST
- [ ] Implementar soft delete con campo `deleted_at`
- [ ] Asegurar que queries filtren por `user_id` del usuario autenticado

#### 🎯 Criterios de aceptación

- [ ] CRUD completo funcionando con validación de cuotas
- [ ] Usuarios solo ven sus propios proyectos
- [ ] Soft delete implementado correctamente
- [ ] Todos los tests pasan con coverage >80%

---

### **TASK-B-010: Job de Renovación de Cuotas** ⭐

**Prioridad:** 🟡 MEDIA  
**Estimación:** 2 horas  
**Dependencias:** TASK-B-006  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-13 - Gestión de Planes y Validación de Cuotas  
**Marcador MVP:** ⭐ **RECOMENDADO**

#### 📋 Descripción

Implementar job programado que resetee contadores de cuota para usuarios de pago cuando llegue su fecha de renovación. El plan FREE nunca se renueva.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Job resetea `projects_count` de usuarios con `quota_reset_date` vencida
  - Job NO resetea usuarios con plan FREE
  - Job actualiza `quota_reset_date` al próximo mes
  - Job no afecta usuarios cuya fecha aún no vence
- [ ] **Tests de integración:**
  - Ejecutar job manualmente y verificar cambios en DB

**Ubicación:** `src/modules/billing/quota-reset.job.spec.ts`

#### ✅ Tareas específicas

- [ ] Instalar `@nestjs/schedule` si no está instalado
- [ ] Crear `QuotaResetJob` en módulo billing (o users)
- [ ] Implementar método `@Cron('0 0 * * *')` que ejecute a medianoche
- [ ] Query debe:
  - Filtrar usuarios donde `quota_reset_date <= NOW()` Y `plan != 'FREE'`
  - Resetear `projects_count = 0`
  - Actualizar `quota_reset_date` sumando 1 mes
- [ ] Usar transacción para atomicidad
- [ ] Agregar logs para auditoría del job
- [ ] Documentar en README cómo testear el job manualmente

#### 🎯 Criterios de aceptación

- [ ] Job se ejecuta diariamente a medianoche
- [ ] Solo afecta usuarios de pago con fecha vencida
- [ ] Usuarios FREE nunca son afectados
- [ ] Logs registran cantidad de usuarios actualizados

---

## 📊 Resumen de Progreso - Fase 1

| Task ID    | Título                        | Prioridad  | Estado       | Estimación |
| ---------- | ----------------------------- | ---------- | ------------ | ---------- |
| TASK-B-006 | Módulo de Usuarios            | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-007 | Guard de Validación de Cuotas | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-008 | Rate Limiting con PostgreSQL  | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-009 | Módulo de Proyectos           | 🔴 CRÍTICA | 🔲 PENDIENTE | 4h         |
| TASK-B-010 | Job de Renovación de Cuotas   | 🟡 MEDIA   | 🔲 PENDIENTE | 2h         |

**Total Fase 1:** 15 horas estimadas

---

## 🤖 FASE 2: Pipeline de IA

---

### **TASK-B-011: Integración con Claude API (Anthropic SDK)** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-005  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-05 - Análisis de Viabilidad con Streaming  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear módulo `ai` con servicio wrapper para Anthropic SDK. Implementar método base para llamadas a Claude con configuración de modelo, tokens y manejo de errores. Este servicio será la base para todas las generaciones de IA.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Servicio inicializa correctamente con API key
  - `generate()` retorna respuesta de Claude
  - Error si `ANTHROPIC_API_KEY` no está configurada
  - Timeout configurable funciona correctamente
  - Retry automático en errores 429 y 5xx
- [ ] **Tests de integración:**
  - Llamada real a Claude API (usar mock en CI)

**Ubicación:** `src/modules/ai/ai.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Instalar `@anthropic-ai/sdk`
- [ ] Crear módulo `ai` con estructura feature-based
- [ ] Crear `AiService` con configuración:
  - Modelo: `claude-sonnet-4-20250514` (configurable via env)
  - Max tokens: 4096 (configurable)
  - Timeout: 30 segundos
- [ ] Implementar método `generate(systemPrompt, userPrompt, options)`:
  - Acepta prompts de sistema y usuario
  - Retorna texto generado
  - Maneja errores de API
- [ ] Implementar retry con backoff exponencial para errores 429, 500, 502, 529
- [ ] Crear tipos/interfaces para opciones y respuestas
- [ ] Agregar logging de requests (sin exponer contenido sensible)

#### 🎯 Criterios de aceptación

- [ ] Servicio funciona con API key válida
- [ ] Retry automático en errores transitorios
- [ ] Errores se propagan con mensajes claros
- [ ] Configuración externalizada en variables de entorno

---

### **TASK-B-012: Streaming de Respuestas con SSE** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 4 horas  
**Dependencias:** TASK-B-011  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-05 - Análisis de Viabilidad con Streaming  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar streaming de respuestas de Claude usando Server-Sent Events (SSE). El frontend recibirá chunks de texto progresivamente para mejorar UX durante generaciones largas.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - `generateStream()` retorna Observable con chunks
  - Chunks tienen formato `{ type: 'text', content: '...' }`
  - Stream envía evento `done` al finalizar
  - Stream envía evento `error` si falla
- [ ] **Tests e2e:**
  - Endpoint SSE retorna headers correctos (`text/event-stream`)
  - Cliente recibe múltiples chunks progresivamente

**Ubicación:** `src/modules/ai/ai.service.spec.ts`, `test/ai-streaming.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Agregar método `generateStream()` en `AiService`:
  - Usar `stream: true` en llamada a Anthropic
  - Retornar Observable que emite chunks
- [ ] Crear decorator o helper para endpoints SSE en NestJS
- [ ] Implementar formato de eventos:
  - `data: {"type": "text", "content": "..."}\n\n`
  - `data: {"type": "done"}\n\n`
  - `data: {"type": "error", "message": "..."}\n\n`
- [ ] Manejar cancelación de stream (cliente desconecta)
- [ ] Implementar acumulación de contenido parcial para recuperación
- [ ] Agregar timeout específico para streams (60 segundos)

#### 🎯 Criterios de aceptación

- [ ] Chunks llegan progresivamente al cliente
- [ ] Stream se cierra correctamente al finalizar
- [ ] Desconexión del cliente cancela la generación
- [ ] Errores se transmiten via evento `error`

---

### **TASK-B-013: Endpoint de Análisis de Viabilidad** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 4 horas  
**Dependencias:** TASK-B-009, TASK-B-012  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-05 - Análisis de Viabilidad con Streaming  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear endpoint que analice la idea del proyecto usando Claude y retorne un análisis técnico con streaming. El análisis debe incluir resumen, riesgos técnicos, stack recomendado y estimación inicial.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Prompt incluye descripción del proyecto y stack seleccionado
  - Análisis se guarda como borrador en `analysis_draft`
  - Endpoint de confirmación guarda versión final en `analysis_result`
  - QuotaGuard bloquea si usuario excede límite
  - RateLimitGuard bloquea regeneraciones excesivas
- [ ] **Tests e2e:**
  - POST `/projects/:id/analyze` retorna stream SSE y guarda borrador
  - PATCH `/projects/:id/analysis` confirma el texto final
  - Usuario FREE puede analizar su único proyecto

**Ubicación:** `src/modules/projects/analysis.service.spec.ts`, `test/analysis.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear `AnalysisService` en módulo projects
- [ ] Agregar campo `analysis_draft` (TEXT nullable) a entidad Project para borrador
- [ ] Diseñar system prompt para análisis de viabilidad:
  - Instruir a Claude sobre formato de salida esperado
  - Incluir contexto del stack elegido por el usuario
  - Solicitar secciones: Resumen, Riesgos, Stack Final, Estimación
- [ ] Implementar endpoint POST `/projects/:id/analyze`:
  - Aplicar `@CheckQuota('GENERATE_AI')`
  - Aplicar `@RateLimit('analyze', 3, 3600)` (3/hora)
  - Retornar stream SSE con análisis
  - **Guardar resultado en `analysis_draft` (borrador, no definitivo)**
- [ ] Implementar endpoint PATCH `/projects/:id/analysis`:
  - Body: `{ content: string }` (texto final editado por usuario)
  - **Guardar en `analysis_result` (versión definitiva aprobada)**
  - Esto permite al usuario editar antes de confirmar
- [ ] Implementar endpoint POST `/projects/:id/analyze/regenerate`:
  - Misma lógica pero marca como regeneración
  - Validar rate limit específico de regeneración

#### 🎯 Criterios de aceptación

- [ ] Análisis se genera con streaming visible
- [ ] Resultado se guarda como borrador (`analysis_draft`)
- [ ] Usuario puede editar y confirmar versión final (`analysis_result`)
- [ ] Guards de cuota y rate limit funcionan
- [ ] Regeneración respeta límite de 3/hora

---

### **TASK-B-014: Manejo de Errores de IA y Resiliencia** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-011, TASK-B-012  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-14 - Resiliencia ante Fallos de IA  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar manejo robusto de errores de Claude API: timeouts, rate limits, errores de servidor y streams interrumpidos. La cuota solo se consume si la generación completa exitosamente.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Timeout (30s) no consume cuota
  - Error 429 ejecuta retry con backoff
  - Error 500/502/529 ejecuta máximo 2 retries
  - Stream interrumpido guarda contenido parcial
  - Cuota solo decrementa en éxito completo
- [ ] **Tests de integración:**
  - Simular timeout y verificar respuesta al cliente
  - Simular error 429 y verificar retry automático

**Ubicación:** `src/modules/ai/error-handler.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Crear `AiErrorHandler` service con estrategias por tipo de error:
  - `TIMEOUT`: no retry, retornar error con mensaje amigable
  - `RATE_LIMIT_429`: retry con backoff (10s, 30s, 60s)
  - `SERVER_ERROR`: retry 2 veces con 5s de espera
  - `STREAM_INTERRUPTED`: guardar parcial, permitir continuar
- [ ] Implementar transacción para operaciones de cuota:
  - Iniciar transacción antes de llamar a Claude
  - Commit solo si generación exitosa
  - Rollback si hay error
- [ ] Crear tabla `ai_generations` para auditoría:
  - `user_id`, `project_id`, `type`, `status`, `error_type`, `attempts`, `created_at`
- [ ] Implementar endpoint POST `/projects/:id/analyze/continue`:
  - Recibe contenido parcial como contexto
  - Instruye a Claude a continuar desde ese punto
- [ ] Integrar con Sentry para logging de errores (si configurado)

#### 🎯 Criterios de aceptación

- [ ] Errores transitorios se reintentan automáticamente
- [ ] Cuota nunca se consume en generaciones fallidas
- [ ] Contenido parcial se puede recuperar
- [ ] Errores se loguean para análisis

---

### **TASK-B-015: Generación de Historias de Usuario** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 4 horas  
**Dependencias:** TASK-B-013  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-06 - Generación Automática de Historias de Usuario  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear endpoint que genere historias de usuario a partir del análisis aprobado. Claude debe retornar JSON estructurado con historias en formato estándar (título, narrativa, criterios de aceptación).

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Prompt incluye análisis del proyecto como contexto
  - Respuesta de Claude se parsea como JSON válido
  - Historias se validan con class-validator antes de guardar
  - Error si JSON no cumple schema esperado
  - Historias se crean con `is_approved = false`
- [ ] **Tests e2e:**
  - POST `/projects/:id/stories/generate` crea historias en DB
  - GET `/projects/:id/stories` lista historias generadas
  - Rate limit de 3 regeneraciones/hora funciona

**Ubicación:** `src/modules/stories/stories.service.spec.ts`, `test/stories.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear módulo `stories` con estructura feature-based
- [ ] Crear entidad `UserStory` con campos:
  - `id`, `project_id`, `title`, `narrative`
  - `acceptance_criteria` (JSONB array)
  - `is_approved` (boolean, default false)
  - `position` (integer para ordenamiento)
  - `created_at`, `updated_at`
- [ ] Crear migración para tabla `user_stories`
- [ ] Diseñar system prompt para generación de historias:
  - Formato JSON estricto con schema definido
  - Incluir análisis del proyecto como contexto
  - Solicitar 5-15 historias según complejidad
- [ ] Implementar `StoriesService` con `generateFromAnalysis()`
- [ ] Crear DTOs con validación: `CreateStoryDto`, `StoryResponseDto`
- [ ] Implementar endpoints:
  - POST `/projects/:id/stories/generate` (genera con streaming)
  - GET `/projects/:id/stories` (lista todas)
  - PATCH `/projects/:id/stories/:storyId` (editar)
  - DELETE `/projects/:id/stories/:storyId` (eliminar)
  - PATCH `/projects/:id/stories/:storyId/approve` (toggle aprobación)

#### 🎯 Criterios de aceptación

- [ ] Historias se generan en formato JSON válido
- [ ] Validación de schema antes de persistir
- [ ] CRUD completo de historias funciona
- [ ] Solo historias del proyecto del usuario son accesibles

---

## 📊 Resumen de Progreso - Fase 2

| Task ID    | Título                             | Prioridad  | Estado       | Estimación |
| ---------- | ---------------------------------- | ---------- | ------------ | ---------- |
| TASK-B-011 | Integración con Claude API         | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-012 | Streaming de Respuestas con SSE    | 🔴 CRÍTICA | 🔲 PENDIENTE | 4h         |
| TASK-B-013 | Endpoint de Análisis de Viabilidad | 🔴 CRÍTICA | 🔲 PENDIENTE | 4h         |
| TASK-B-014 | Manejo de Errores de IA            | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-015 | Generación de Historias de Usuario | 🔴 CRÍTICA | 🔲 PENDIENTE | 4h         |

**Total Fase 2:** 18 horas estimadas

---

## ⚙️ FASE 3: Gestión Técnica

---

### **TASK-B-016: Desglose Técnico de Tareas (Frontend/Backend)** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 5 horas  
**Dependencias:** TASK-B-015  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-08 - Desglose Técnico con Separación de Contextos  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear endpoint que convierta historias aprobadas en tareas técnicas, clasificándolas automáticamente en Frontend y Backend. Validar límite de 20 tareas para usuarios FREE antes de generar.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Solo historias con `is_approved=true` se procesan
  - Tareas se clasifican correctamente (FRONTEND/BACKEND)
  - IDs siguen patrón `TASK-[F|B]-XXX`
  - Usuario FREE bloqueado si supera 20 tareas totales
  - Dependencias entre tareas se resuelven correctamente
- [ ] **Tests e2e:**
  - POST `/projects/:id/tasks/generate` crea tareas separadas por tipo
  - Tareas incluyen `story_id` de la historia origen
  - Usuario FREE con 15 tareas puede generar máximo 5 más

**Ubicación:** `src/modules/tasks/tasks.service.spec.ts`, `test/tasks.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear módulo `tasks` con estructura feature-based
- [ ] Crear entidad `TechnicalTask` con campos:
  - `id`, `project_id`, `story_id`, `type` (enum: FRONTEND, BACKEND)
  - `title`, `description`, `estimated_hours`
  - `dependencies` (JSONB array de task IDs)
  - `acceptance_criteria` (JSONB array)
  - `status` (enum: TODO, DOING, DONE)
  - `position` (integer), `notes` (text nullable)
  - `started_at`, `completed_at`, `created_at`, `updated_at`
- [ ] Crear migración para tabla `technical_tasks`
- [ ] Diseñar system prompt para desglose técnico:
  - Incluir historias aprobadas + stack del proyecto
  - Solicitar separación explícita Frontend/Backend
  - Formato JSON con schema definido
- [ ] Implementar validación de cuota de tareas para FREE:
  - Calcular `tareas_existentes + nuevas_tareas`
  - Bloquear si excede 20, retornar error con cuántas puede crear
- [ ] Implementar generación de IDs secuenciales por tipo
- [ ] Implementar endpoint POST `/projects/:id/tasks/generate`

#### 🎯 Criterios de aceptación

- [ ] Tareas se generan clasificadas por tipo
- [ ] Validación de cuota FREE funciona correctamente
- [ ] IDs son únicos y siguen convención
- [ ] Dependencias entre tareas son válidas

---

### **TASK-B-017: CRUD de Tareas Técnicas** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-016  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-09 - Tablero Kanban  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar endpoints CRUD para tareas técnicas. Incluir filtrado por tipo (Frontend/Backend), búsqueda por título y ordenamiento por posición.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Listar tareas filtra por proyecto del usuario
  - Filtro por tipo funciona (FRONTEND, BACKEND, ALL)
  - Búsqueda por título usa ILIKE
  - Ordenamiento por posición ASC
  - Actualizar tarea preserva campos no enviados
- [ ] **Tests e2e:**
  - GET `/projects/:id/tasks` lista tareas con paginación
  - GET `/projects/:id/tasks?type=BACKEND` filtra correctamente
  - PATCH `/tasks/:id` actualiza campos específicos
  - DELETE `/tasks/:id` elimina tarea y reordena posiciones

**Ubicación:** `src/modules/tasks/tasks.service.spec.ts`, `test/tasks.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Implementar `TasksService` con métodos CRUD
- [ ] Crear DTOs: `CreateTaskDto`, `UpdateTaskDto`, `TaskResponseDto`, `TaskFilterDto`
- [ ] Implementar endpoints:
  - GET `/projects/:id/tasks` (listar con filtros y paginación)
  - GET `/tasks/:id` (detalle de tarea)
  - POST `/projects/:id/tasks` (crear manual)
  - PATCH `/tasks/:id` (actualizar)
  - DELETE `/tasks/:id` (eliminar)
- [ ] Implementar query params:
  - `type`: FRONTEND | BACKEND | ALL
  - `status`: TODO | DOING | DONE
  - `search`: búsqueda por título (ILIKE)
  - `page`, `limit`: paginación
- [ ] Asegurar que solo el dueño del proyecto puede acceder

#### 🎯 Criterios de aceptación

- [ ] CRUD completo funciona
- [ ] Filtros y búsqueda funcionan correctamente
- [ ] Paginación implementada
- [ ] Autorización por proyecto funciona

---

### **TASK-B-018: Gestión de Estado y Posición (Kanban)** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-017  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-09 - Tablero Kanban (Drag & Drop)  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar endpoints para cambiar estado de tareas y reordenar posiciones. Soportar movimiento entre columnas (TODO→DOING→DONE) y reordenamiento dentro de la misma columna. Usar transacciones para atomicidad.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Cambiar status actualiza `started_at` cuando pasa a DOING
  - Cambiar status actualiza `completed_at` cuando pasa a DONE
  - Reordenar actualiza posiciones de todas las tareas afectadas
  - Mover entre columnas asigna última posición + 1
  - Transacción hace rollback si falla algún update
- [ ] **Tests e2e:**
  - PATCH `/tasks/:id/status` cambia estado correctamente
  - PATCH `/tasks/:id/reorder` actualiza posición
  - Movimiento masivo funciona atómicamente

**Ubicación:** `src/modules/tasks/tasks.service.spec.ts`, `test/tasks-kanban.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Implementar endpoint PATCH `/tasks/:id/status`:
  - Body: `{ status: 'DOING' }`
  - Si cambia a DOING: setear `started_at = NOW()`
  - Si cambia a DONE: setear `completed_at = NOW()`
  - Retornar tarea actualizada
- [ ] Implementar endpoint PATCH `/tasks/:id/reorder`:
  - Body: `{ status: 'TODO', position: 3 }`
  - Usar transacción DB para actualizar posiciones
  - Recalcular posiciones de tareas afectadas
- [ ] Implementar lógica de reordenamiento:
  - Mover dentro de columna: shift positions
  - Mover entre columnas: asignar `MAX(position) + 1` en destino
- [ ] Crear índice en DB: `(project_id, status, position)`
- [ ] Optimizar queries para evitar N+1

#### 🎯 Criterios de aceptación

- [ ] Cambios de estado actualizan timestamps correctamente
- [ ] Reordenamiento es atómico (transacción)
- [ ] Posiciones siempre son consistentes (sin gaps ni duplicados)
- [ ] Performance aceptable con 100+ tareas

---

### **TASK-B-019: Módulo de Notas de Usuario** ⭐

**Prioridad:** 🟡 MEDIA  
**Estimación:** 2 horas  
**Dependencias:** TASK-B-006  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-16 - Block de Notas Global (Dev Journal)  
**Marcador MVP:** ⭐ **RECOMENDADO**

#### 📋 Descripción

Crear módulo de notas con soporte para notas globales (usuario) y notas de proyecto. Implementar autoguardado y límites de caracteres/cantidad.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Nota global tiene `project_id = NULL`
  - Nota de proyecto tiene `project_id` válido
  - Límite de 50,000 caracteres se valida
  - Límite de 100 notas por usuario se valida
  - Update con contenido idéntico no crea nueva versión
- [ ] **Tests e2e:**
  - GET `/notes` lista notas globales del usuario
  - GET `/projects/:id/notes` lista notas del proyecto
  - PATCH `/notes/:id` actualiza contenido

**Ubicación:** `src/modules/notes/notes.service.spec.ts`, `test/notes.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear módulo `notes` con estructura feature-based
- [ ] Crear entidad `UserNote` con campos:
  - `id`, `user_id`, `project_id` (nullable)
  - `content` (TEXT, max 50000)
  - `created_at`, `updated_at`
- [ ] Crear migración para tabla `user_notes`
- [ ] Implementar `NotesService` con validaciones:
  - Max 50,000 caracteres por nota
  - Max 100 notas por usuario
- [ ] Implementar endpoints:
  - GET `/notes` (notas globales)
  - GET `/projects/:id/notes` (notas de proyecto)
  - POST `/notes` (crear nota global)
  - POST `/projects/:id/notes` (crear nota de proyecto)
  - PATCH `/notes/:id` (actualizar)
  - DELETE `/notes/:id` (eliminar)
- [ ] Crear DTOs con validación de longitud

#### 🎯 Criterios de aceptación

- [ ] Notas globales y de proyecto funcionan
- [ ] Límites de caracteres y cantidad validados
- [ ] Solo el dueño puede acceder a sus notas
- [ ] Autoguardado desde frontend funciona (idempotente)

---

### **TASK-B-020: Notas en Tareas Técnicas** ⭐

**Prioridad:** 🟡 MEDIA  
**Estimación:** 1 hora  
**Dependencias:** TASK-B-017  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-09 - Tablero Kanban (Modal de Detalle)  
**Marcador MVP:** ⭐ **RECOMENDADO**

#### 📋 Descripción

Agregar campo de notas privadas a las tareas técnicas. Permitir al usuario guardar anotaciones específicas por tarea (snippets, recordatorios, links).

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Campo `notes` acepta hasta 10,000 caracteres
  - Update de notas no afecta otros campos de la tarea
  - Notas se retornan en detalle de tarea
- [ ] **Tests e2e:**
  - PATCH `/tasks/:id` con `{ notes: '...' }` actualiza correctamente
  - GET `/tasks/:id` incluye campo notes

**Ubicación:** `src/modules/tasks/tasks.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Verificar que entidad `TechnicalTask` tiene campo `notes` (TEXT nullable)
- [ ] Agregar validación de longitud máxima (10,000 caracteres)
- [ ] Incluir `notes` en `TaskResponseDto`
- [ ] Permitir actualización de `notes` via PATCH `/tasks/:id`
- [ ] Agregar índice GIN para búsqueda full-text en notas (opcional)

#### 🎯 Criterios de aceptación

- [ ] Campo notes se puede crear/leer/actualizar
- [ ] Validación de longitud funciona
- [ ] No hay impacto en performance de queries existentes

---

## 📊 Resumen de Progreso - Fase 3

| Task ID    | Título                       | Prioridad  | Estado       | Estimación |
| ---------- | ---------------------------- | ---------- | ------------ | ---------- |
| TASK-B-016 | Desglose Técnico de Tareas   | 🔴 CRÍTICA | 🔲 PENDIENTE | 5h         |
| TASK-B-017 | CRUD de Tareas Técnicas      | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-018 | Gestión de Estado y Posición | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-019 | Módulo de Notas de Usuario   | 🟡 MEDIA   | 🔲 PENDIENTE | 2h         |
| TASK-B-020 | Notas en Tareas Técnicas     | 🟡 MEDIA   | 🔲 PENDIENTE | 1h         |

**Total Fase 3:** 14 horas estimadas

---

## 📦 FASE 4: Entregables y Documentación

---

### **TASK-B-021: Generación de ARCHITECTURE.md** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 4 horas  
**Dependencias:** TASK-B-016  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-10 - Generación de Documentación de Contexto  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Generar archivo ARCHITECTURE.md usando Claude basado en el stack y configuración del proyecto. Si el usuario eligió arquitectura estándar, consultar documentación oficial del framework. Generar versiones separadas para backend y frontend.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Prompt incluye stack y metodología del proyecto
  - Arquitectura estándar genera estructura según framework
  - Arquitectura manual incluye reglas custom del usuario
  - Documento se guarda en tabla `project_documents`
- [ ] **Tests e2e:**
  - POST `/projects/:id/docs/generate` crea documentos
  - GET `/projects/:id/docs/architecture/backend` retorna contenido

**Ubicación:** `src/modules/documents/documents.service.spec.ts`, `test/documents.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear módulo `documents` con estructura feature-based
- [ ] Crear entidad `ProjectDocument` con campos:
  - `id`, `project_id`
  - `type` (enum: ARCHITECTURE_BACKEND, ARCHITECTURE_FRONTEND, DEV_GUIDE_BACKEND, DEV_GUIDE_FRONTEND)
  - `content` (TEXT)
  - `created_at`, `updated_at`
- [ ] Crear migración para tabla `project_documents`
- [ ] Diseñar system prompt para ARCHITECTURE.md:
  - Incluir stack, framework y metodología
  - Si arquitectura estándar: pedir estructura según docs oficiales
  - Si arquitectura manual: usar reglas del campo `architecture_custom`
  - Secciones: Estructura de carpetas, Patrones, Convenciones, Ejemplo de código
- [ ] Implementar `DocumentsService` con `generateArchitecture(projectId, context: 'backend' | 'frontend')`
- [ ] Implementar endpoint POST `/projects/:id/docs/architecture/generate`

#### 🎯 Criterios de aceptación

- [ ] Documento refleja stack y metodología elegidos
- [ ] Versiones backend y frontend son diferentes
- [ ] Contenido se persiste en base de datos
- [ ] Regeneración sobrescribe documento anterior

---

### **TASK-B-022: Generación de AI_DEVELOPMENT_GUIDE.md** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-021  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-10 - Generación de Documentación de Contexto  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Generar archivo AI_DEVELOPMENT_GUIDE.md con instrucciones específicas según la metodología elegida (TDD, DDD, etc.). Incluir comandos de setup, cómo ejecutar tests, convenciones de commits.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Metodología TDD incluye reglas Red-Green-Refactor
  - Metodología DDD incluye ejemplos de Value Objects
  - Documento incluye comandos de npm/yarn
  - Convenciones de commits siguen Conventional Commits
- [ ] **Tests e2e:**
  - GET `/projects/:id/docs/guide/backend` retorna guía
  - Documento tiene secciones requeridas

**Ubicación:** `src/modules/documents/documents.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Diseñar system prompt para AI_DEVELOPMENT_GUIDE.md:
  - Adaptar contenido según metodología elegida
  - TDD: ciclo obligatorio, ejemplos de tests
  - DDD: estructura de dominio, aggregates
  - Estándar: buenas prácticas generales
- [ ] Secciones obligatorias:
  - Comandos de setup del proyecto
  - Cómo ejecutar tests (`npm run test`, `npm run test:e2e`)
  - Cómo hacer commits (Conventional Commits)
  - Reglas de code style (ESLint, Prettier)
  - Ciclo de calidad pre-commit
- [ ] Implementar `generateDevGuide(projectId, context: 'backend' | 'frontend')`
- [ ] Implementar endpoint POST `/projects/:id/docs/guide/generate`
- [ ] Generar ambas versiones (backend y frontend) en una sola llamada

#### 🎯 Criterios de aceptación

- [ ] Guía refleja metodología elegida
- [ ] Comandos son específicos al stack (npm vs yarn, etc.)
- [ ] Secciones obligatorias presentes
- [ ] Documento es útil para copiar a IA

---

### **TASK-B-023: Generación de Backlogs con Prompts Integrados** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 5 horas  
**Dependencias:** TASK-B-016, TASK-B-021, TASK-B-022  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-11 - Generación de Backlogs Ejecutables con Prompt Integrado  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Generar archivos BACKEND_BACKLOG.md y FRONTEND_BACKLOG.md con cada tarea incluyendo un bloque de código con el prompt completo pre-armado para copiar y pegar en la IA.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Backlog backend solo incluye tareas tipo BACKEND
  - Backlog frontend solo incluye tareas tipo FRONTEND
  - Cada tarea tiene bloque de código con prompt
  - Tareas ordenadas topológicamente por dependencias
  - Template incluye referencias a docs de gobernanza
- [ ] **Tests e2e:**
  - GET `/projects/:id/backlog/backend` retorna markdown válido
  - Prompt incluye stack, metodología y criterios de aceptación

**Ubicación:** `src/modules/documents/backlog.service.spec.ts`, `test/backlog.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear `BacklogService` en módulo documents
- [ ] Diseñar template de prompt por tarea:
  - Header con TASK_ID y título
  - Sección "Contexto" con rol de experto
  - Referencia a archivos de gobernanza
  - Descripción de la tarea
  - Metodología a seguir
  - Criterios de aceptación como checklist
  - Stack técnico
  - Output esperado (archivos a crear)
- [ ] **Contexto Dinámico por Stack:**
  - Leer `project.stack_backend` para determinar rutas de gobernanza
  - MVP: NestJS usa `docs/backend/ARCHITECTURE.md`
  - **NOTA FUTURA:** Si se soporta Python/FastAPI, ajustar ruta a `docs/api/ARCHITECTURE.md`
- [ ] Implementar ordenamiento topológico de tareas por dependencias
- [ ] Implementar `generateBacklog(projectId, type: 'backend' | 'frontend')`:
  - Filtrar tareas por tipo
  - Ordenar por dependencias
  - Generar markdown con template
- [ ] Implementar endpoints:
  - GET `/projects/:id/backlog/backend` (retorna markdown)
  - GET `/projects/:id/backlog/frontend` (retorna markdown)
  - POST `/projects/:id/backlog/regenerate` (regenera ambos)
- [ ] Guardar backlogs generados en `project_documents`

#### 🎯 Criterios de aceptación

- [ ] Backlogs separados por tipo (backend/frontend)
- [ ] Prompts son copiables y funcionales
- [ ] Ordenamiento respeta dependencias
- [ ] Template incluye toda la información necesaria

---

### **TASK-B-024: Descarga de Context Kit (ZIP)** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-023  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-12 - Descarga del Context Kit  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear endpoint que genere y descargue un archivo ZIP con todos los entregables: backlogs, documentación de arquitectura, guías de desarrollo y README con instrucciones.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - ZIP contiene todos los archivos esperados
  - Estructura de carpetas es correcta
  - README incluye instrucciones de uso
  - Headers de respuesta son correctos para descarga
- [ ] **Tests e2e:**
  - GET `/projects/:id/context-kit/download` retorna ZIP válido
  - ZIP se puede descomprimir correctamente

**Ubicación:** `src/modules/documents/context-kit.service.spec.ts`, `test/context-kit.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Instalar `archiver` o `jszip` para generación de ZIP
- [ ] Crear `ContextKitService` en módulo documents
- [ ] Implementar generación de estructura:
  ```
  project-name-context-kit.zip
  ├── README.md
  ├── BACKEND_BACKLOG.md
  ├── FRONTEND_BACKLOG.md
  └── docs/
      ├── backend/
      │   ├── ARCHITECTURE.md
      │   └── AI_DEVELOPMENT_GUIDE.md
      └── frontend/
          ├── ARCHITECTURE.md
          └── AI_DEVELOPMENT_GUIDE.md
  ```
- [ ] Generar README.md con:
  - Descripción del proyecto
  - Stack tecnológico
  - Instrucciones de uso de backlogs con IA
  - Estructura del Context Kit
- [ ] Implementar endpoint GET `/projects/:id/context-kit/download`:
  - Generar ZIP en memoria
  - Headers: `Content-Type: application/zip`
  - Headers: `Content-Disposition: attachment; filename="..."`
- [ ] Verificar que todos los documentos existen antes de generar

#### 🎯 Criterios de aceptación

- [ ] ZIP contiene todos los archivos requeridos
- [ ] Estructura de carpetas es correcta
- [ ] README es útil y completo
- [ ] Descarga funciona en navegador

---

### **TASK-B-025: Vista Previa de Documentos** ⭐

**Prioridad:** 🟡 MEDIA  
**Estimación:** 2 horas  
**Dependencias:** TASK-B-023  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-12 - Descarga del Context Kit (Preview)  
**Marcador MVP:** ⭐ **RECOMENDADO**

#### 📋 Descripción

Implementar endpoints para previsualizar cada documento del Context Kit antes de descargar. Permitir al usuario revisar el contenido y regenerar si es necesario.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Endpoint retorna contenido markdown del documento
  - Error 404 si documento no ha sido generado
  - Metadata incluye fecha de generación
- [ ] **Tests e2e:**
  - GET `/projects/:id/docs/:type` retorna documento
  - Response incluye `content` y `generatedAt`

**Ubicación:** `src/modules/documents/documents.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Implementar endpoints de lectura:
  - GET `/projects/:id/docs/architecture/backend`
  - GET `/projects/:id/docs/architecture/frontend`
  - GET `/projects/:id/docs/guide/backend`
  - GET `/projects/:id/docs/guide/frontend`
  - GET `/projects/:id/backlog/backend`
  - GET `/projects/:id/backlog/frontend`
- [ ] Crear DTO de respuesta con:
  - `content`: string (markdown)
  - `type`: tipo de documento
  - `generatedAt`: timestamp
- [ ] Implementar endpoint para listar documentos disponibles:
  - GET `/projects/:id/docs` → lista con tipos y fechas
- [ ] Retornar 404 con mensaje claro si documento no existe

#### 🎯 Criterios de aceptación

- [ ] Todos los tipos de documento son accesibles
- [ ] Response incluye metadata útil
- [ ] Errores son claros y manejables

---

## 📊 Resumen de Progreso - Fase 4

| Task ID    | Título                             | Prioridad  | Estado       | Estimación |
| ---------- | ---------------------------------- | ---------- | ------------ | ---------- |
| TASK-B-021 | Generación de ARCHITECTURE.md      | 🔴 CRÍTICA | 🔲 PENDIENTE | 4h         |
| TASK-B-022 | Generación de AI_DEVELOPMENT_GUIDE | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-023 | Generación de Backlogs con Prompts | 🔴 CRÍTICA | 🔲 PENDIENTE | 5h         |
| TASK-B-024 | Descarga de Context Kit (ZIP)      | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-025 | Vista Previa de Documentos         | 🟡 MEDIA   | 🔲 PENDIENTE | 2h         |

**Total Fase 4:** 17 horas estimadas

---

## 💰 FASE 5: Monetización

---

### **TASK-B-026: Módulo de Billing y Configuración de Stripe** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-006  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-15 - Upgrade de Plan  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear módulo `billing` con configuración de Stripe SDK. Definir productos y precios para los planes Basic ($2.99/mes) y Pro ($7.99/mes). NO implementar add-ons, solo planes fijos.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Stripe SDK inicializa correctamente con API key
  - Configuración de productos carga desde env
  - Servicio retorna precios correctos por plan
  - Error si variables de Stripe no configuradas
- [ ] **Tests de integración:**
  - Conexión con Stripe API funciona (test mode)

**Ubicación:** `src/modules/billing/billing.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Instalar `stripe` SDK
- [ ] Crear módulo `billing` con estructura feature-based
- [ ] Crear configuración de Stripe en `src/config/stripe.config.ts`:
  - `STRIPE_SECRET_KEY` (requerido)
  - `STRIPE_WEBHOOK_SECRET` (requerido)
  - `STRIPE_BASIC_PRICE_ID` (ID del precio Basic)
  - `STRIPE_PRO_PRICE_ID` (ID del precio Pro)
- [ ] Crear `BillingService` con métodos:
  - `getStripeClient()`: retorna instancia configurada
  - `getPriceIdForPlan(plan)`: mapea plan a price ID
  - `getPlanFromPriceId(priceId)`: mapea price ID a plan
- [ ] Documentar en README cómo crear productos en Stripe Dashboard:
  - Producto "Genesis Basic" → Precio $2.99/mes (recurring)
  - Producto "Genesis Pro" → Precio $7.99/mes (recurring)
- [ ] Agregar variables a `.env.example`

#### 🎯 Criterios de aceptación

- [ ] Stripe SDK configurado y funcional
- [ ] Mapeo de planes a precios funciona
- [ ] Variables de entorno documentadas
- [ ] Modo test de Stripe funciona correctamente

---

### **TASK-B-027: Checkout Session de Stripe** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-026  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-15 - Upgrade de Plan  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar endpoint para crear Checkout Session de Stripe. El usuario será redirigido a la página de pago hosted de Stripe para completar la suscripción.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Checkout session se crea con metadata del usuario
  - Plan inválido retorna 400
  - Usuario ya con plan superior recibe error
  - success_url y cancel_url son correctas
- [ ] **Tests e2e:**
  - POST `/billing/checkout` retorna sessionId y url
  - Usuario puede acceder a la URL de Stripe

**Ubicación:** `src/modules/billing/billing.service.spec.ts`, `test/billing.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear DTO `CreateCheckoutDto`:
  - `plan`: 'BASIC' | 'PRO'
- [ ] Implementar endpoint POST `/billing/checkout`:
  - Validar que usuario no tiene ya ese plan o superior
  - Crear Checkout Session con:
    - `mode: 'subscription'`
    - `payment_method_types: ['card']`
    - `line_items`: precio del plan seleccionado
    - `success_url`: `${FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`
    - `cancel_url`: `${FRONTEND_URL}/billing/cancelled`
    - `metadata`: `{ userId, newPlan }`
    - `customer_email`: email del usuario
  - Retornar `{ sessionId, url }`
- [ ] Implementar validación de upgrade lógico:
  - FREE → BASIC ✓
  - FREE → PRO ✓
  - BASIC → PRO ✓
  - PRO → BASIC ✗ (downgrade no permitido via checkout)
- [ ] Agregar guard de autenticación al endpoint

#### 🎯 Criterios de aceptación

- [ ] Checkout session se crea correctamente
- [ ] Metadata incluye userId y newPlan
- [ ] URLs de redirect son correctas
- [ ] Validación de upgrade funciona

---

### **TASK-B-028: Webhook de Stripe (checkout.session.completed)** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 4 horas  
**Dependencias:** TASK-B-027  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-15 - Upgrade de Plan  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Implementar endpoint webhook para recibir eventos de Stripe. Procesar `checkout.session.completed` para actualizar el plan del usuario. Verificar firma del webhook para seguridad.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Firma de webhook se verifica correctamente
  - Evento `checkout.session.completed` actualiza plan
  - Usuario recibe nuevo plan y `quota_reset_date`
  - Evento duplicado no causa problemas (idempotencia)
  - Evento con firma inválida retorna 400
- [ ] **Tests e2e:**
  - POST `/billing/webhook` con evento válido actualiza usuario
  - Verificar que usuario tiene nuevo plan después del webhook

**Ubicación:** `src/modules/billing/webhook.service.spec.ts`, `test/billing-webhook.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Crear controller separado `WebhookController` para manejar raw body
- [ ] Configurar endpoint POST `/billing/webhook`:
  - Usar `@RawBody()` para obtener body sin parsear
  - Verificar firma con `stripe.webhooks.constructEvent()`
  - NO requerir autenticación JWT (webhook viene de Stripe)
- [ ] Implementar handler para `checkout.session.completed`:
  - Extraer `userId` y `newPlan` de `session.metadata`
  - Actualizar `user.plan` al nuevo plan
  - Setear `user.quota_reset_date` a fecha actual + 1 mes
  - **Resetear `user.projects_count` a 0 ("nuevo plan, nueva vida")**
  - **NOTA:** En upgrade mid-cycle (ej: Basic→Pro), Stripe maneja prorrateo.
    Nuestra lógica resetea contador a 0 dándole al usuario el límite completo del nuevo plan.
    Esto es intencional y generoso para UX.
  - Guardar `stripe_customer_id` en usuario para futuras referencias
- [ ] Implementar idempotencia:
  - Guardar `event.id` en tabla `processed_webhooks`
  - Ignorar eventos ya procesados
- [ ] Crear tabla `processed_webhooks` con campos:
  - `event_id` (string, unique)
  - `event_type` (string)
  - `processed_at` (timestamp)
- [ ] Agregar logging detallado de webhooks

#### 🎯 Criterios de aceptación

- [ ] Webhook verifica firma correctamente
- [ ] Plan se actualiza al completar pago
- [ ] Cuotas se resetean al upgrade
- [ ] Eventos duplicados no causan problemas

---

### **TASK-B-029: Webhook de Cancelación y Renovación** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-028  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-15 - Upgrade de Plan (Cancelación)  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Manejar eventos de Stripe para cancelación de suscripción y fallo de pago. Implementar lógica de degradación a plan FREE cuando la suscripción termina.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - `customer.subscription.deleted` degrada usuario a FREE
  - `invoice.payment_failed` notifica al usuario (no degrada inmediatamente)
  - Usuario degradado mantiene `free_project_used=true`
  - Cancelación al final del período no degrada inmediatamente
- [ ] **Tests e2e:**
  - Simular evento de cancelación y verificar cambio de plan

**Ubicación:** `src/modules/billing/webhook.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Agregar handler para `customer.subscription.deleted`:
  - Buscar usuario por `stripe_customer_id`
  - Degradar `user.plan` a FREE
  - Mantener `free_project_used = true` (NO puede crear proyectos gratis)
  - Limpiar `quota_reset_date`
- [ ] Agregar handler para `customer.subscription.updated`:
  - Detectar si subscription está en estado `canceled` (cancelación programada)
  - Guardar `user.plan_cancel_at` con fecha de fin
- [ ] Agregar handler para `invoice.payment_failed`:
  - Loguear el fallo
  - Opcional: enviar notificación al usuario (email o in-app)
  - NO degradar inmediatamente (Stripe reintentará)
- [ ] Agregar campos a entidad User:
  - `stripe_customer_id` (string nullable)
  - `stripe_subscription_id` (string nullable)
  - `plan_cancel_at` (timestamp nullable)
- [ ] Crear migración para nuevos campos

#### 🎯 Criterios de aceptación

- [ ] Cancelación degrada a FREE correctamente
- [ ] Usuario degradado no puede crear proyectos gratis
- [ ] Cancelación programada muestra fecha de fin
- [ ] Fallos de pago se loguean sin degradar

---

### **TASK-B-030: Endpoints de Información de Billing** ⭐

**Prioridad:** 🟡 MEDIA  
**Estimación:** 2 horas  
**Dependencias:** TASK-B-028  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-15 - Upgrade de Plan (UI de Billing)  
**Marcador MVP:** ⭐ **RECOMENDADO**

#### 📋 Descripción

Implementar endpoints para consultar información de billing: plan actual, uso de cuota, fecha de renovación, historial de pagos y portal de cliente de Stripe.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Endpoint retorna plan y uso actual
  - Fecha de renovación calculada correctamente
  - Portal de cliente genera URL válida
  - Usuario FREE no tiene historial de pagos
- [ ] **Tests e2e:**
  - GET `/billing/status` retorna información completa
  - POST `/billing/portal` retorna URL de portal

**Ubicación:** `src/modules/billing/billing.service.spec.ts`, `test/billing.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Implementar endpoint GET `/billing/status`:
  - Retornar:
    - `plan`: plan actual
    - `projectsUsed`: proyectos creados
    - `projectsLimit`: límite según plan
    - `tasksUsed`: tareas creadas (solo relevante para FREE)
    - `tasksLimit`: 20 para FREE, null para pago
    - `renewsAt`: fecha de renovación (solo pago)
    - `cancelsAt`: fecha de cancelación si aplica
- [ ] Implementar endpoint POST `/billing/portal`:
  - Crear Billing Portal Session de Stripe
  - Retornar URL para que usuario gestione suscripción
  - Solo disponible para usuarios con suscripción activa
- [ ] Implementar endpoint GET `/billing/history`:
  - Consultar invoices de Stripe para el customer
  - Retornar últimos 10 pagos con: fecha, monto, status
  - Retornar array vacío si no hay historial
- [ ] Crear DTOs de respuesta para cada endpoint

#### 🎯 Criterios de aceptación

- [ ] Status de billing es preciso
- [ ] Portal de Stripe es accesible
- [ ] Historial muestra pagos reales
- [ ] Información es útil para UI de billing

---

## 📊 Resumen de Progreso - Fase 5

| Task ID    | Título                              | Prioridad  | Estado       | Estimación |
| ---------- | ----------------------------------- | ---------- | ------------ | ---------- |
| TASK-B-026 | Configuración de Stripe             | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-027 | Checkout Session                    | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-028 | Webhook checkout.session.completed  | 🔴 CRÍTICA | 🔲 PENDIENTE | 4h         |
| TASK-B-029 | Webhook de Cancelación y Renovación | 🔴 CRÍTICA | 🔲 PENDIENTE | 3h         |
| TASK-B-030 | Endpoints de Información de Billing | 🟡 MEDIA   | 🔲 PENDIENTE | 2h         |

**Total Fase 5:** 15 horas estimadas

---

## ✨ FASE 6: Polish y Extras

---

### **TASK-B-031: Métricas de Proyecto** ⭐

**Prioridad:** 🟢 BAJA  
**Estimación:** 3 horas  
**Dependencias:** TASK-B-018  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-17 - Métricas de Uso del Proyecto  
**Marcador MVP:** ⭐ **POST-MVP**

#### 📋 Descripción

Implementar endpoint que calcule y retorne métricas del proyecto: tareas completadas, tiempo estimado vs real, velocidad de desarrollo y distribución por tipo.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Cálculo de tareas completadas es correcto
  - Tiempo real se calcula desde `started_at` y `completed_at`
  - Velocidad promedio considera solo días activos
  - Distribución Frontend/Backend es precisa
- [ ] **Tests e2e:**
  - GET `/projects/:id/metrics` retorna todas las métricas

**Ubicación:** `src/modules/projects/metrics.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Crear `MetricsService` en módulo projects
- [ ] Implementar cálculo de métricas:
  - `totalTasks`: total de tareas
  - `completedTasks`: tareas con status DONE
  - `estimatedHours`: suma de `estimated_hours`
  - `actualHours`: suma de tiempo real (completed_at - started_at)
  - `averageVelocity`: tareas/día desde primera tarea
  - `frontendTasks`: count de tipo FRONTEND
  - `backendTasks`: count de tipo BACKEND
- [ ] Implementar endpoint GET `/projects/:id/metrics`
- [ ] Crear DTO de respuesta `ProjectMetricsDto`
- [ ] Optimizar queries para evitar N+1 (usar agregaciones SQL)

#### 🎯 Criterios de aceptación

- [ ] Métricas son precisas y útiles
- [ ] Performance aceptable con muchas tareas
- [ ] Response incluye todos los campos definidos

---

### **TASK-B-032: Sistema de Feedback** ⭐

**Prioridad:** 🟢 BAJA  
**Estimación:** 2 horas  
**Dependencias:** TASK-B-013, TASK-B-015, TASK-B-016  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-18 - Sistema de Feedback y Mejora Continua  
**Marcador MVP:** ⭐ **POST-MVP**

#### 📋 Descripción

Crear módulo para recolectar feedback de usuarios sobre las generaciones de IA. Permitir calificar y comentar cada tipo de generación (análisis, historias, tareas).

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Feedback se crea con rating y tipo de generación
  - Comentario es opcional
  - Un usuario puede dar feedback una vez por generación
  - Rating solo acepta valores válidos (1-5 o thumbs)
- [ ] **Tests e2e:**
  - POST `/feedback` crea registro de feedback
  - GET `/feedback` (admin) lista feedback agregado

**Ubicación:** `src/modules/feedback/feedback.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Crear módulo `feedback` con estructura feature-based
- [ ] Crear entidad `Feedback` con campos:
  - `id`, `user_id`, `project_id`
  - `generation_type` (enum: ANALYSIS, STORIES, TASKS, DOCS)
  - `rating` (enum: EXCELLENT, GOOD, NEEDS_IMPROVEMENT)
  - `comment` (text nullable)
  - `created_at`
- [ ] Crear migración para tabla `feedback`
- [ ] Implementar endpoints:
  - POST `/projects/:id/feedback` (crear feedback)
  - GET `/admin/feedback` (listar para admin, protegido)
  - GET `/admin/feedback/stats` (estadísticas agregadas)
- [ ] Implementar constraint: un feedback por tipo por proyecto
- [ ] Crear DTOs con validación

#### 🎯 Criterios de aceptación

- [ ] Usuarios pueden dar feedback
- [ ] Feedback se asocia correctamente al proyecto y tipo
- [ ] Admin puede ver estadísticas agregadas

---

### **TASK-B-033: Endpoint de Onboarding Status** ⭐

**Prioridad:** 🟡 MEDIA  
**Estimación:** 1 hora  
**Dependencias:** TASK-B-006  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** HU-03 - Tutorial Interactivo  
**Marcador MVP:** ⭐ **RECOMENDADO**

#### 📋 Descripción

Crear endpoint para consultar y actualizar el estado del onboarding del usuario. El frontend usará esto para mostrar/ocultar el tutorial interactivo.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Usuario nuevo tiene `has_completed_onboarding = false`
  - Endpoint actualiza flag correctamente
  - Flag no se puede revertir a false
- [ ] **Tests e2e:**
  - GET `/users/me/onboarding` retorna estado
  - PATCH `/users/me/onboarding` marca como completado

**Ubicación:** `src/modules/users/users.service.spec.ts`

#### ✅ Tareas específicas

- [ ] Verificar que campo `has_completed_onboarding` existe en entidad User
- [ ] Implementar endpoint GET `/users/me/onboarding`:
  - Retornar `{ completed: boolean }`
- [ ] Implementar endpoint PATCH `/users/me/onboarding`:
  - Body: `{ completed: true }`
  - Solo permite setear a true (no revertir)
- [ ] Agregar al response de `/users/me` el campo `has_completed_onboarding`

#### 🎯 Criterios de aceptación

- [ ] Estado de onboarding es consultable
- [ ] Se puede marcar como completado
- [ ] No se puede revertir a incompleto

---

### **TASK-B-034: Health Check y Readiness Probes** ⭐

**Prioridad:** 🟡 MEDIA  
**Estimación:** 1.5 horas  
**Dependencias:** TASK-B-001, TASK-B-002  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** Configuración Inicial  
**Marcador MVP:** ⭐ **RECOMENDADO**

#### 📋 Descripción

Mejorar endpoint de health check para incluir verificación de dependencias (DB, Stripe, Claude API). Útil para monitoreo y orquestadores de contenedores.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Tests unitarios:**
  - Health check retorna OK si todo está bien
  - Health check indica qué servicio falla
  - Liveness probe es simple y rápido
  - Readiness probe verifica todas las dependencias
- [ ] **Tests e2e:**
  - GET `/health` retorna 200 si healthy
  - GET `/health/ready` verifica DB y servicios

**Ubicación:** `src/health/health.controller.spec.ts`

#### ✅ Tareas específicas

- [ ] Instalar `@nestjs/terminus` para health checks
- [ ] Crear módulo `health` con controller
- [ ] Implementar endpoint GET `/health` (liveness):
  - Simple check que la app responde
  - Retornar `{ status: 'ok', timestamp: ... }`
- [ ] Implementar endpoint GET `/health/ready` (readiness):
  - Verificar conexión a PostgreSQL
  - Verificar que Stripe API key es válida (opcional)
  - Verificar que Anthropic API key es válida (opcional)
  - Retornar detalle de cada check
- [ ] Agregar timeouts a cada check (max 5 segundos)
- [ ] Retornar 503 si algún servicio crítico falla

#### 🎯 Criterios de aceptación

- [ ] Liveness probe es rápido (<100ms)
- [ ] Readiness probe verifica todas las dependencias
- [ ] Respuestas siguen formato estándar
- [ ] Útil para despliegue en Kubernetes/Docker

---

### **TASK-B-035: Suite de Tests E2E Completa** ⭐⭐

**Prioridad:** 🔴 CRÍTICA  
**Estimación:** 6 horas  
**Dependencias:** Todas las tareas anteriores  
**Estado:** 🔲 PENDIENTE  
**HU Relacionada:** Testing End-to-End  
**Marcador MVP:** ⭐⭐ **CORE**

#### 📋 Descripción

Crear suite completa de tests end-to-end que cubra los flujos principales de la aplicación. Usar base de datos de test separada y fixtures para datos de prueba.

#### 🧪 Testing

**Tests necesarios:**

- [ ] **Flujo de Autenticación:**
  - Registro → Login → Acceso a ruta protegida
  - Token expirado rechazado
- [ ] **Flujo de Proyecto Completo:**
  - Crear proyecto → Análisis → Historias → Tareas → Docs → Download
- [ ] **Flujo de Cuotas:**
  - Usuario FREE crea proyecto → free_project_used = true
  - Usuario FREE intenta crear segundo proyecto → 403
  - Usuario FREE con 20 tareas → 403 al crear más
- [ ] **Flujo de Billing:**
  - Checkout → Webhook → Plan actualizado
  - Cancelación → Degradación a FREE

**Ubicación:** `test/*.e2e-spec.ts`

#### ✅ Tareas específicas

- [ ] Configurar base de datos de test separada
- [ ] Crear helpers de test:
  - `createTestUser(overrides)`: crea usuario con JWT
  - `createTestProject(userId, overrides)`: crea proyecto
  - `mockClaudeResponse(content)`: mock de Claude API
  - `mockStripeWebhook(event)`: simula webhook de Stripe
- [ ] Crear fixtures de datos:
  - Usuario FREE con proyecto
  - Usuario BASIC con varios proyectos
  - Proyecto con historias y tareas
- [ ] Implementar tests E2E para cada flujo crítico
- [ ] Configurar limpieza de DB entre tests
- [ ] Agregar coverage report para E2E
- [ ] Documentar cómo ejecutar tests E2E localmente

#### 🎯 Criterios de aceptación

- [ ] Todos los flujos críticos tienen test E2E
- [ ] Tests son reproducibles y no flaky
- [ ] Coverage E2E > 70% de endpoints
- [ ] CI ejecuta tests E2E en cada PR

---

## 📊 Resumen de Progreso - Fase 6

| Task ID    | Título                          | Prioridad  | Estado       | Estimación |
| ---------- | ------------------------------- | ---------- | ------------ | ---------- |
| TASK-B-031 | Métricas de Proyecto            | 🟢 BAJA    | 🔲 PENDIENTE | 3h         |
| TASK-B-032 | Sistema de Feedback             | 🟢 BAJA    | 🔲 PENDIENTE | 2h         |
| TASK-B-033 | Endpoint de Onboarding Status   | 🟡 MEDIA   | 🔲 PENDIENTE | 1h         |
| TASK-B-034 | Health Check y Readiness Probes | 🟡 MEDIA   | 🔲 PENDIENTE | 1.5h       |
| TASK-B-035 | Suite de Tests E2E Completa     | 🔴 CRÍTICA | 🔲 PENDIENTE | 6h         |

**Total Fase 6:** 13.5 horas estimadas

---

## 📈 RESUMEN GLOBAL DEL BACKLOG

| Fase   | Nombre                      | Tareas | Horas Estimadas |
| ------ | --------------------------- | ------ | --------------- |
| Fase 0 | Configuración del Entorno   | 5      | 13.5h           |
| Fase 1 | Módulos Core                | 5      | 15h             |
| Fase 2 | Pipeline de IA              | 5      | 18h             |
| Fase 3 | Gestión Técnica             | 5      | 14h             |
| Fase 4 | Entregables y Documentación | 5      | 17h             |
| Fase 5 | Monetización                | 5      | 15h             |
| Fase 6 | Polish y Extras             | 5      | 13.5h           |

### **TOTAL: 35 tareas | 106 horas estimadas**

---

## 🎯 Orden de Ejecución Recomendado

### Sprint 1 (Semanas 1-2): Fundación

- TASK-B-001 → TASK-B-005 (Fase 0)
- TASK-B-006, TASK-B-007 (Fase 1 parcial)

### Sprint 2 (Semanas 3-4): Core + Auth

- TASK-B-008 → TASK-B-010 (Fase 1)
- TASK-B-011, TASK-B-012 (Fase 2 parcial)

### Sprint 3 (Semanas 5-6): Pipeline de IA

- TASK-B-013 → TASK-B-015 (Fase 2)

### Sprint 4 (Semanas 7-8): Gestión

- TASK-B-016 → TASK-B-020 (Fase 3)

### Sprint 5 (Semanas 9-10): Entregables

- TASK-B-021 → TASK-B-025 (Fase 4)

### Sprint 6 (Semanas 11-12): Monetización + Polish

- TASK-B-026 → TASK-B-030 (Fase 5)
- TASK-B-031 → TASK-B-035 (Fase 6)

---

**✅ BACKLOG COMPLETO - Listo para ejecución**
