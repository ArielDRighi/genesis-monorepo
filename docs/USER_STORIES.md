# 📚 Historias de Usuario - GENESIS (MVP) - V2

**Visión:** Plataforma SaaS "Single-Player" para desarrolladores que orquestan el ciclo de vida completo de desarrollo de software asistido por IA. Transforma ideas abstractas en código de producción mediante un pipeline estructurado, manteniendo contextos limpios y una gobernanza estricta.

### 👥 Actores

- **Usuario:** Desarrollador (Roles: Free, Basic, Pro).
- **Sistema (Orquestador):** Backend NestJS que gestiona la lógica de negocio y conecta con la IA (Claude 3.5 Sonnet).

---

## 🎨 EPIC 1: Onboarding & Dashboard (Gestión de Acceso)

### HU-01: Registro y Autenticación JWT Nativa

- **Como** usuario nuevo,
- **Quiero** registrarme ingresando email y contraseña,
- **Para** obtener un token de acceso seguro y entrar a mi espacio privado de trabajo.
  - **Criterios de Aceptación:**
    - **Backend:** Implementar estrategia JWT nativa en NestJS utilizando `@nestjs/jwt` y `@nestjs/passport`.
    - **Seguridad:** Las contraseñas deben ser hasheadas obligatoriamente con `bcrypt` antes de persistir en la base de datos PostgreSQL.
    - **Onboarding:** Al momento del registro exitoso, el sistema debe asignar automáticamente el plan `FREE` al usuario e inicializar sus contadores de uso (`projects_count = 0`, `free_project_used = false`, `quota_reset_date = NULL` ya que Free no tiene renovación).
    - **Frontend:** El cliente debe interceptar el token, persistirlo (localStorage/Cookies) y adjuntarlo en el header `Authorization: Bearer` de todas las peticiones subsiguientes.
    - **Validación:** El formulario debe validar formato de email y longitud mínima de contraseña (8 caracteres) en tiempo real (Zod).

### HU-02: Dashboard de Proyectos y Control de Progreso

- **Como** usuario,
- **Quiero** visualizar una grilla con todos mis proyectos activos, viendo claramente su stack tecnológico y porcentaje de avance,
- **Para** decidir rápidamente en qué proyecto continuar trabajando.
  - **Criterios de Aceptación:**
    - **Visualización de Tarjeta:** Cada proyecto debe mostrar: Nombre, Descripción corta (truncada a 120 caracteres), Iconos del Stack (Frontend/Backend) y una Barra de Progreso calculada dinámicamente (`(Tareas "Done" / Tareas Totales) * 100`).
    - **Acción de Creación:** Debe existir un botón o tarjeta especial "[+] Nuevo Proyecto" siempre visible como primer elemento.
    - **Bloqueo por Cuota (Frontend):** Si el usuario ha alcanzado el límite de proyectos de su plan actual (ej: 1/1 en Free con máx 20 tareas), el botón de crear debe estar visualmente deshabilitado y, al hacer hover/click, mostrar un Tooltip/Modal invitando a mejorar el plan. Para usuarios Free, mostrar también el contador de tareas usadas (ej: "15/20 tareas utilizadas").
    - **Bloqueo por Cuota (Backend):** El endpoint de creación debe rechazar la petición con un error `403 Forbidden` con código `QUOTA_EXCEEDED` si la cuota está llena, independientemente del frontend. Para usuarios Free, también validar que `tasks_count < 20`.
    - **Ordenamiento:** Los proyectos deben mostrarse ordenados por `updated_at DESC` (más recientes primero).

### HU-03: Tutorial Interactivo (First-Time Experience)

- **Como** usuario nuevo,
- **Quiero** ver un tutorial rápido (2-3 minutos) que me explique el flujo completo de la plataforma,
- **Para** entender cómo usar Genesis sin leer documentación extensa.
  - **Criterios de Aceptación:**
    - **Trigger:** Mostrar tour guiado automáticamente en la primera sesión del usuario (verificar flag `has_completed_onboarding = false` en DB).
    - **Contenido del Tour:** Tooltips interactivos mostrando:
      1. Cómo crear un proyecto
      2. Qué es la validación de idea
      3. Cómo funciona el Kanban
      4. Dónde descargar el Context Kit
    - **Implementación:** Usar librería como `react-joyride` o `driver.js`.
    - **Control de Usuario:** Botón "Saltar tutorial" visible en todo momento.
    - **Persistencia:** Al completar o saltar, actualizar `has_completed_onboarding = true` en DB.
    - **Repetición:** Agregar opción "Ver tutorial de nuevo" en página de Settings.

---

## 🧠 EPIC 2: El Arquitecto (Definición Técnica y Gobernanza)

### HU-04: Definición Profunda del Proyecto (Stack, Metodología y Arquitectura)

- **Como** usuario (Desarrollador),
- **Quiero** definir no solo la idea y el stack, sino también la **metodología de desarrollo** y las **reglas de arquitectura**,
- **Para** que la IA genere código que cumpla estrictamente con mis estándares de calidad y estilo de trabajo.
  - **Criterios de Aceptación:**
    - **Input de Idea:** Campo `Textarea` amplio (min 100 caracteres) para describir la funcionalidad del proyecto.
    - **Selector de Stack:** Dropdowns para elegir:
      - Lenguaje Backend (Node.js, Python, Go)
      - Framework Backend (NestJS, Express, FastAPI, Gin)
      - Lenguaje/Framework Frontend (React, Vue, Angular, Svelte)
      - Base de Datos (PostgreSQL, MongoDB, MySQL)
    - **Selector de Metodología:** Un Select para indicar la metodología deseada:
      - TDD Estricto (Red-Green-Refactor obligatorio)
      - DDD (Domain-Driven Design)
      - Clean Architecture
      - Arquitectura Hexagonal
      - Estándar (sin metodología específica)
    - **Definición de Arquitectura:**
      - **Opción A (Estándar/Recomendada - Default):** El sistema sugiere la arquitectura ideal según la documentación oficial del framework elegido (ej: estructura de módulos para NestJS, feature-based para Next.js).
      - **Opción B (Manual):** Un campo de texto libre (Textarea con Markdown support) donde el usuario puede pegar sus propias reglas de arquitectura o estructura de carpetas preferida.
    - **Persistencia:** Todos estos parámetros deben guardarse en la tabla `projects` con columnas: `idea_description`, `stack_backend`, `stack_frontend`, `database`, `methodology`, `architecture_type`, `architecture_custom`.

### HU-05: Análisis de Viabilidad con Streaming y Edición Manual

- **Como** usuario,
- **Quiero** ver el análisis técnico de la IA apareciendo en tiempo real y **tener la capacidad de editar manualmente el texto resultante**,
- **Para** corregir alucinaciones de la IA o ajustar el enfoque técnico (ej: cambiar una librería sugerida) sin gastar créditos ni tiempo en regenerar el informe completo.
  - **Criterios de Aceptación:**
    - **Streaming UI:** El texto del análisis (Resumen, Riesgos, Stack Final) debe renderizarse progresivamente para reducir la percepción de latencia.
    - **Implementación Backend (Streaming):**
      - NestJS debe retornar un stream usando decorador `@Sse()` (Server-Sent Events) o configurar Response como stream.
      - Consumir Claude API con parámetro `stream: true`.
      - Enviar chunks progresivamente al cliente en formato: `data: {"type": "text", "content": "..."}\n\n`.
    - **Implementación Frontend (Streaming):**
      - Usar `EventSource` API o `fetch` con `ReadableStream`.
      - Renderizar cada chunk en tiempo real en un componente con cursor parpadeante.
      - Manejar error de stream interrumpido: mostrar lo generado hasta ese punto + botón "Continuar generación".
    - **Modo Edición:** Al finalizar la generación, los bloques de texto deben convertirse en campos editables (componente `Textarea` con auto-resize o editor Rich Text como TipTap).
    - **Acción Regenerar:** Botón "Regenerar Análisis" que vuelve a solicitar a la IA (mostrar warning: "Esto consumirá 1 uso de tu cuota. ¿Continuar?").
    - **Acción Confirmar:** Botón "Guardar y Continuar" que persiste el texto **actualmente visible en el editor** (sea el original de la IA o el modificado por el usuario) en la columna `analysis_result` de la tabla `projects`.

---

## 📋 EPIC 3: El Project Manager (Historias de Usuario)

### HU-06: Generación Estructurada de Historias de Usuario

- **Como** usuario,
- **Quiero** que el sistema transforme mi idea aprobada en una lista estructurada de Historias de Usuario con Criterios de Aceptación claros,
- **Para** definir el alcance funcional exacto y no tener que redactar documentos manualmente.
  - **Criterios de Aceptación:**
    - **Prompt System:** El backend debe instruir a Claude para devolver estrictamente un JSON array con estructura:
    ```json
    {
      "stories": [
        {
          "id": "HU-001",
          "title": "Registro de usuario",
          "narrative": "Como usuario nuevo, quiero registrarme...",
          "acceptance_criteria": ["Validación de email", "Contraseña de al menos 8 caracteres"]
        }
      ]
    }
    ```
    - **Validación:** El backend debe validar que el JSON cumple este schema usando `class-validator` antes de persistir.
    - **Persistencia:** Guardar en tabla `user_stories` con columnas: `project_id`, `title`, `narrative`, `acceptance_criteria` (JSONB), `is_approved` (boolean, default false).
    - **Visualización:** Lista de tarjetas colapsables (Acordeón shadcn/ui) para facilitar la lectura. Cada tarjeta debe mostrar título y badge con cantidad de criterios.

### HU-07: Gestión y Refinamiento del Alcance

- **Como** usuario,
- **Quiero** editar el contenido de las historias generadas, eliminar las que no correspondan o agregar nuevas manualmente,
- **Para** refinar el proyecto y asegurarme de que la IA entendió lo que quiero construir antes de pasar a la fase de código.
  - **Criterios de Aceptación:**
    - **Edición Inline:** Posibilidad de hacer clic en el título o narrativa de una historia y editarla ahí mismo (componente `ContentEditable` o Input en modo edición).
    - **Gestión:** Botones visibles en cada tarjeta:
      - "✏️ Editar" (abre modal con formulario completo)
      - "🗑️ Eliminar" (pide confirmación)
      - "✓ Aprobar/Desaprobar" (toggle del campo `is_approved`)
    - **Agregar Manual:** Botón "[+] Agregar Historia Manual" al final de la lista que abre formulario con campos: título, narrativa, criterios de aceptación (lista dinámica).
    - **Validation Gate:** El botón "Generar Tareas Técnicas" debe estar deshabilitado si no hay al menos una historia con `is_approved = true`. Mostrar tooltip explicativo.

---

## ⚙️ EPIC 4: El Tech Lead (Desglose Técnico y Gestión)

### HU-08: Desglose Técnico con Separación de Contextos

- **Como** usuario,
- **Quiero** que el sistema convierta las historias aprobadas en tareas técnicas, clasificándolas automáticamente en "Frontend" y "Backend",
- **Para** mantener la separación de responsabilidades y evitar que la IA mezcle lógica de servidor con interfaz de usuario en los pasos siguientes.
  - **Criterios de Aceptación:**
    - **Input:** Todas las historias con `is_approved = true` + configuración del proyecto (stack, metodología).
    - **Prompt a Claude:** Solicitar explícitamente un JSON con estructura:
    ```json
    {
      "tasks": [
        {
          "id": "TASK-F-001",
          "type": "FRONTEND",
          "title": "Crear componente de login",
          "description": "Implementar formulario de login con validación...",
          "story_id": "HU-001",
          "estimated_hours": 3,
          "dependencies": [],
          "acceptance_criteria": ["Validación de email en tiempo real", "Manejo de errores de API"]
        },
        {
          "id": "TASK-B-002",
          "type": "BACKEND",
          "title": "Endpoint POST /auth/login",
          "description": "Crear endpoint que valide credenciales...",
          "story_id": "HU-001",
          "estimated_hours": 2,
          "dependencies": ["TASK-B-001"],
          "acceptance_criteria": ["Retornar JWT válido", "Validar credenciales contra DB"]
        }
      ]
    }
    ```
    - **Validación de Schema:** Usar `class-validator` en NestJS para validar estructura antes de persistir.
    - **Validación de Cuota Free:** Antes de generar tareas, verificar si el usuario es Free y si `project.tasks_count + nuevas_tareas <= 20`. Si se excede, retornar error `403 QUOTA_EXCEEDED` con mensaje: "Has alcanzado el límite de 20 tareas de tu plan gratuito. Suscríbete para continuar."
    - **Persistencia:** Guardar en tabla `technical_tasks` con columnas: `project_id`, `story_id`, `type`, `title`, `description`, `estimated_hours`, `dependencies` (JSONB), `acceptance_criteria` (JSONB), `status` (enum: TODO, DOING, DONE), `position` (integer para ordenamiento).
    - **Generación de IDs:** Los IDs deben ser auto-generados siguiendo patrón `TASK-[F|B]-XXX` donde F=Frontend, B=Backend, XXX=número secuencial.

### HU-09: Tablero Kanban Limpio (Gestión de Progreso)

- **Como** usuario,
- **Quiero** ver las tareas en un tablero visual que muestre **solo la información esencial (ID, Título, Estado)**,
- **Para** gestionar el avance del proyecto y mover tarjetas (Drag & Drop) sin que el código de los prompts o descripciones largas saturen la vista.
  - **Criterios de Aceptación:**
    - **Diseño de Tarjeta:** La tarjeta debe ser compacta (max 150px altura). Debe mostrar:
      - ID (ej: `TASK-B-01`) en badge pequeño
      - Título (truncado a 60 caracteres)
      - Badge de tipo (Frontend: 🎨 azul, Backend: 🔧 verde)
      - Estimación en horas (iconito ⏱️ + número)
    - **Columnas:** Tres columnas fijas: `TODO`, `DOING`, `DONE`.
    - **Drag & Drop:** Implementar usando `@dnd-kit/core` de shadcn/ui.
    - **Persistencia de Estado:** Al soltar una tarjeta:
      1. Actualizar su campo `status` en DB.
      2. Llamar endpoint `PATCH /tasks/:id/status` con body `{ status: 'DOING' }`.
    - **Persistencia de Orden:**
      - Cada tarea tiene campo `position` (integer).
      - Al mover una tarjeta dentro de la misma columna, recalcular `position` de todas las tareas afectadas.
      - Al mover entre columnas, asignarle la última posición en la columna destino + 1.
      - Endpoint `PATCH /tasks/:id/reorder` con body `{ status: 'TODO', position: 3 }`.
      - Usar transacción DB para actualizar múltiples `position` atómicamente.
    - **Carga Inicial:** Al cargar el Kanban, ordenar tareas por `position ASC` dentro de cada `status`.
    - **Modal de Detalle:** Al hacer clic en una tarjeta, abrir Sheet (panel lateral) mostrando:
      - Título completo (editable inline)
      - Descripción completa (textarea editable)
      - Prompt optimizado para IA en bloque de código con sintaxis highlight y botón "📋 Copiar Prompt"
      - Criterios de aceptación (lista con checkboxes)
      - Historia vinculada (link que navega a la sección de historias)
      - Selector de estado (dropdown: TODO/DOING/DONE)
      - Campo "Notas Privadas" (textarea libre que se guarda en campo `notes`)
      - Botón "Ver en Context Kit" (scroll al archivo .md correspondiente cuando se genere)
    - **Filtros:** Agregar filtros encima del Kanban:
      - `[Todos]` `[Frontend]` `[Backend]`
      - Búsqueda por título (input con debounce de 300ms)

---

## 📦 EPIC 5: Entregables (Ejecución y Metodología)

### HU-10: Generación de Documentación de Contexto (Gobernanza)

- **Como** usuario,
- **Quiero** que el sistema genere automáticamente los archivos de gobernancia (`ARCHITECTURE.md`, `AI_DEVELOPMENT_GUIDE.md`),
- **Para** que cuando pegue el prompt del backlog en la IA, esta tenga archivos reales a los cuales referenciar y aprender el estilo del proyecto.
  - **Criterios de Aceptación:**
    - **Trigger de Generación:**
      - Los archivos de gobernanza se generan automáticamente DESPUÉS de completar la generación de tareas técnicas (HU-08).
      - Mostrar loader en UI: "⚙️ Generando documentación de arquitectura..." (duración estimada: 20-30 segundos).
      - Una vez completado, habilitar botón "📥 Descargar Context Kit" en el dashboard del proyecto.
    - **Regeneración Manual:** Agregar botón "🔄 Regenerar Documentación" en settings del proyecto (útil si el usuario editó muchas tareas después).
    - **Generación de `ARCHITECTURE.md`:**
      - Debe reflejar la arquitectura elegida en HU-04 (Estándar o Manual).
      - Si es Estándar: consultar documentación oficial del framework (ej: para NestJS, estructura de módulos, providers, controllers).
      - Debe incluir:
        - Estructura de carpetas recomendada
        - Patrones de diseño a seguir
        - Convenciones de nombrado
        - Ejemplo de código de referencia
      - Guardar en tabla `project_documents` con columnas: `project_id`, `type` (enum: ARCHITECTURE_BACKEND, ARCHITECTURE_FRONTEND, DEV_GUIDE_BACKEND, DEV_GUIDE_FRONTEND), `content` (TEXT).
    - **Generación de `AI_DEVELOPMENT_GUIDE.md`:**
      - Debe incluir instrucciones específicas sobre la metodología elegida en HU-04.
      - Si es TDD: incluir regla "Red-Green-Refactor obligatoria en cada tarea".
      - Si es DDD: incluir ejemplos de Value Objects y Aggregates.
      - Debe incluir:
        - Comandos de setup del proyecto
        - Cómo ejecutar tests
        - Cómo hacer commits (conventional commits)
        - Reglas de code style (ESLint, Prettier config)
    - **Separación Backend/Frontend:**
      - Generar 4 archivos separados:
        - `docs/backend/ARCHITECTURE.md`
        - `docs/backend/AI_DEVELOPMENT_GUIDE.md`
        - `docs/frontend/ARCHITECTURE.md`
        - `docs/frontend/AI_DEVELOPMENT_GUIDE.md`

### HU-11: Generación de Backlogs Ejecutables con Prompt Integrado

- **Como** usuario,
- **Quiero** descargar los archivos `BACKEND_BACKLOG.md` y `FRONTEND_BACKLOG.md` donde cada tarea esté estructurada de forma clara y ejecutable,
- **Para** desarrollar copiando el prompt base y ejecutando cada tarea con la IA sin tener que redactar contexto ni instrucciones manualmente.

  - **Criterios de Aceptación:**

    - **Formato del Archivo:** Markdown estándar.
    - **IMPORTANTE - Estructura SIN código de ejemplo:**
      - Los backlogs generados **NO deben incluir ejemplos de código** en las tareas.
      - Cada tarea debe describir QUÉ hacer, no CÓMO hacerlo.
      - La IA que ejecute la tarea debe escribir el código desde cero siguiendo los documentos de gobernanza.
    - **Estructura de Cada Tarea:**

    ```markdown
    ### **TASK-B-XXX: Título descriptivo de la tarea** ⭐⭐

    **Prioridad:** 🔴 CRÍTICA | 🟡 MEDIA | 🟢 BAJA
    **Estimación:** X horas
    **Dependencias:** TASK-B-YYY o Ninguna
    **Estado:** 🔲 PENDIENTE
    **HU Relacionada:** HU-XX

    #### 📋 Descripción

    Descripción clara y concisa de la tarea. Qué se debe lograr,
    sin incluir código de ejemplo ni implementación sugerida.

    #### 🧪 Testing

    **Tests necesarios:**

    - [ ] **Tests unitarios:** Lista de casos a testear
    - [ ] **Tests e2e:** Lista de flujos a verificar
          **Ubicación:** Ruta de los archivos de test

    #### ✅ Tareas específicas

    - [ ] Paso 1 a realizar
    - [ ] Paso 2 a realizar
    - [ ] Paso N a realizar

    #### 🎯 Criterios de aceptación

    - [ ] Criterio verificable 1
    - [ ] Criterio verificable 2
    ```

    - **Prompt Base al inicio del archivo:**
      - El backlog debe incluir un "Prompt Base" al inicio que la IA debe leer antes de ejecutar cualquier tarea.
      - Este prompt base referencia los documentos de gobernanza (`ARCHITECTURE.md`, `AI_DEVELOPMENT_GUIDE.md`).
      - Define el workflow de ejecución, metodología y ciclo de calidad.
    - **Template Dinámico:**
      - El template debe llenarse con datos de:
        - Tarea (título, descripción, criterios)
        - Configuración del proyecto (stack, metodología)
      - Variables a inyectar:
        - `[TASK_ID]`, `[TASK_TITLE]`, `[TASK_DESCRIPTION]`
        - `[STACK_FRAMEWORK]`, `[METHODOLOGY]`
        - `[ACCEPTANCE_CRITERIA]` (lista)
        - `[DEPENDENCIES]` (lista de IDs de tareas)
    - **Separación de Backlogs:**
      - Generar dos archivos independientes:
        - `BACKEND_BACKLOG.md` (solo tareas con `type = 'BACKEND'`)
        - `FRONTEND_BACKLOG.md` (solo tareas con `type = 'FRONTEND'`)
    - **Ordenamiento:** Las tareas deben estar ordenadas topológicamente respetando dependencias (tareas sin dependencias primero).

### HU-12: Descarga del Context Kit (ZIP Completo)

- **Como** usuario,
- **Quiero** descargar un archivo ZIP que contenga todos los entregables (backlogs + documentación),
- **Para** tener todo el contexto necesario en un solo paquete y empezar a desarrollar inmediatamente.
  - **Criterios de Aceptación:**
    - **Estructura del ZIP:**
    ```
    project-name-context-kit.zip
    ├── README.md (instrucciones de uso)
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
    - **Generación:**
      - Backend debe generar el ZIP en memoria usando librería `archiver` o `jszip`.
      - Endpoint: `GET /projects/:id/context-kit/download`.
      - Retornar con headers: `Content-Type: application/zip`, `Content-Disposition: attachment; filename="..."`.
    - **README.md:** Debe incluir:
      - Descripción del proyecto
      - Stack tecnológico
      - Instrucciones de cómo usar los backlogs con IA
      - Link a documentación de Genesis (opcional)
    - **Preview en UI:** Agregar botón "👁️ Vista Previa" que muestre el contenido de cada archivo en un modal antes de descargar.

---

## 💰 EPIC 6: Monetización y Sostenibilidad

### HU-13: Gestión de Planes y Validación de Cuotas

- **Como** sistema,
- **Quiero** validar las cuotas de uso en el backend antes de permitir cualquier llamada a la API de Inteligencia Artificial,
- **Para** asegurar la rentabilidad del negocio y evitar costos excesivos por abuso de la API de Claude.
  - **Criterios de Aceptación:**
    - **Definición de Planes:**
      - **Free:** 1 proyecto único (NO renovable) con límite de **20 tareas técnicas totales**. Una vez consumido (proyecto creado O 20 tareas alcanzadas), el usuario debe suscribirse a un plan de pago para continuar.
      - **Basic ($2.99/mes):** 5 proyectos activos/mes, sin límite de tareas por proyecto.
      - **Pro ($7.99/mes):** 20 proyectos activos/mes, sin límite de tareas por proyecto.
    - **Schema de DB:** Tabla `users` debe tener columnas:
      - `plan` (enum: FREE, BASIC, PRO)
      - `projects_count` (integer, incrementa al crear proyecto)
      - `free_project_used` (boolean, default false) - Indica si el usuario Free ya consumió su proyecto gratuito
      - `quota_reset_date` (timestamp, fecha de renovación) - Solo aplica para planes de pago
    - **Middleware/Guard:** Crear Guard `QuotaGuard` en NestJS que:
      1. Se ejecute antes de endpoints de generación (análisis, historias, tareas, docs).
      2. **Para usuarios Free:** Verificar `user.free_project_used === false` para crear proyecto, y `project.tasks_count < 20` para generar tareas.
      3. **Para usuarios de pago:** Verificar `user.projects_count < getPlanLimit(user.plan)` (sin límite de tareas).
      4. Si excede, retorne error `403 Forbidden` con body: `{ error: 'QUOTA_EXCEEDED', message: 'Has alcanzado tu límite. Suscríbete para continuar.', upgradeUrl: '/billing' }`.
    - **Lógica de Renovación (Solo planes de pago):**
      - Las cuotas se resetean automáticamente en la fecha de aniversario de suscripción.
      - Ejemplo: Usuario se suscribió el 15/12 → próxima renovación 15/01.
      - Campo `quota_reset_date` guarda la fecha exacta.
      - **IMPORTANTE:** El plan Free NO se renueva. El campo `free_project_used` es permanente.
      - Job cron (usando `@nestjs/schedule`) que ejecuta diariamente:
      ```typescript
      @Cron('0 0 * * *') // Todos los días a medianoche
      async resetQuotas() {
        // Solo resetear usuarios con planes de PAGO (NO Free)
        await this.userRepository.update(
          {
            quota_reset_date: LessThanOrEqual(new Date()),
            plan: Not(Equal('FREE')) // Excluir usuarios Free
          },
          {
            projects_count: 0,
            quota_reset_date: () => "quota_reset_date + INTERVAL '1 month'"
          }
        );
      }
      ```
    - **UI de Cuota:** Mostrar en header/sidebar:
      - **Para Free:** Badge con `1/1 proyecto` o `⚠️ Proyecto gratuito consumido` + `X/20 tareas`
      - **Para planes de pago:** Badge con `3/5 proyectos` (dinámico según plan)
      - Progress bar visual
      - Fecha de renovación: "Se renueva en 12 días" (solo para planes de pago)

### HU-13B: Rate Limiting y Control de Abuso

- **Como** sistema,
- **Quiero** limitar la frecuencia de llamadas a Claude API por usuario en tiempo real,
- **Para** evitar costos excesivos por uso abusivo, bugs en el frontend o comportamiento malicioso.

  - **Criterios de Aceptación:**

    - **Límites Definidos:**
      - Máximo 5 proyectos creados por día (**solo aplica a planes de pago** - Free tiene 1 proyecto único total)
      - Máximo 3 regeneraciones de análisis por hora
      - Máximo 3 regeneraciones de historias por hora
      - Máximo 2 regeneraciones de tareas por hora
    - **Implementación con Redis:**
      - Usar Upstash Redis (free tier: 10k commands/día)
      - Keys en Redis: `rate:create_project:{userId}:{date}`, `rate:regen_analysis:{userId}:{hour}`
      - Usar comando `INCR` con `EXPIRE` automático
    - **Guard de Rate Limit:**

    ```typescript
    @Injectable()
    export class RateLimitGuard implements CanActivate {
      async canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const userId = request.user.id;
        const key = `rate:${request.route.path}:${userId}:${getDateKey()}`;

        const count = await this.redis.incr(key);
        if (count === 1) {
          await this.redis.expire(key, getTTL()); // TTL según tipo de límite
        }

        if (count > getLimit(request.route.path)) {
          throw new HttpException(
            {
              error: "RATE_LIMIT_EXCEEDED",
              message: "Has excedido el límite de solicitudes",
              retryAfter: await this.redis.ttl(key),
            },
            429
          );
        }
        return true;
      }
    }
    ```

    - **Response Headers:** Incluir en respuestas exitosas:
      - `X-RateLimit-Limit: 5`
      - `X-RateLimit-Remaining: 2`
      - `X-RateLimit-Reset: 1702234800` (timestamp)
    - **UI de Rate Limit:** Si el usuario recibe 429:
      - Mostrar modal amigable: "⏳ Límite de solicitudes alcanzado"
      - Contador regresivo: "Próximo intento disponible en 2:34 minutos"
      - Explicación: "Esto previene costos excesivos y asegura la sostenibilidad del servicio"

### HU-14: Resiliencia ante Fallos de IA

- **Como** usuario,
- **Quiero** que si la generación de IA falla, el sistema reintente automáticamente y no consuma mi cuota si no se completó exitosamente,
- **Para** no perder dinero ni quedar bloqueado por errores fuera de mi control.
  - **Criterios de Aceptación:**
    - **Tipos de Errores a Manejar:**
      - **Timeout (30s):** Claude no responde en tiempo razonable
      - **Rate Limit (429):** Anthropic está saturado
      - **Error 500/502/529:** Errores del servidor de Anthropic
      - **Stream Interrumpido:** Conexión se corta a mitad de generación
    - **Estrategia de Retry:**
      - **Timeout:** No auto-reintentar. Mostrar error: "⏱️ La generación tomó demasiado tiempo" + botón "Reintentar"
      - **Rate Limit (429):** Auto-reintentar con backoff exponencial:
        - 1er intento: esperar 10s
        - 2do intento: esperar 30s
        - 3er intento: esperar 60s
        - Después de 3 intentos, mostrar error
      - **Error 500/502/529:** Auto-reintentar máximo 2 veces con 5s de espera
      - **Stream Interrumpido:** Guardar contenido parcial + botón "Continuar desde aquí" (enviar lo generado como contexto + instrucción de continuar)
    - **Manejo de Cuota:**
      - **CRÍTICO:** Solo decrementar `projects_count` si la generación completa fue exitosa
      - Usar transacción DB:
      ```typescript
      await this.db.transaction(async (tx) => {
        const result = await this.claudeService.generate(prompt);
        if (result.success) {
          await tx.users.update({ projects_count: user.projects_count + 1 });
          await tx.projects.create({ ...data, status: "COMPLETED" });
        }
      });
      ```
    - **Logging y Monitoreo:**
      - Todos los errores de Claude deben loguearse en Sentry con contexto completo:
        - `userId`, `projectId`, `errorType`, `attemptNumber`
      - Crear dashboard en Sentry para monitorear tasa de errores
    - **UI de Errores:**
      - Error genérico: "❌ Ocurrió un error al generar. No te preocupes, no consumimos tu cuota."
      - Error con retry: "🔄 Reintentando automáticamente... (intento 2 de 3)"
      - Partial generation: Mostrar contenido generado + "⚠️ La generación se interrumpió. ¿Deseas continuar?"

### HU-15: Upgrade de Plan (Sin Add-ons)

- **Como** usuario,
- **Quiero** poder mejorar mi plan mediante una pasarela de pago segura,
- **Para** desbloquear mayor capacidad de proyectos según el plan elegido.

  - **Criterios de Aceptación:**

    - **Opciones de Upgrade (Sin Add-ons):**
      - **Upgrade de Plan:**
        - Free → Basic ($2.99/mes): 5 proyectos/mes, sin límite de tareas
        - Free → Pro ($7.99/mes): 20 proyectos/mes, sin límite de tareas
        - Basic → Pro ($7.99/mes): +15 proyectos extra/mes
      - **⚠️ SIN ADD-ONS:** El usuario NO puede comprar proyectos adicionales sueltos. Debe ajustarse estrictamente a la cantidad de proyectos habilitados por su plan.
    - **Integración con Stripe:**
      - Crear productos y precios en Stripe Dashboard (solo planes, sin add-ons)
      - Implementar Stripe Checkout (modo hosted)
      - Endpoints:
        - `POST /billing/create-checkout-session` → retorna `sessionId`
        - `POST /billing/webhook` → escucha eventos de Stripe
    - **Flujo de Checkout:**
      1. Usuario click en "Upgrade a Basic" o "Upgrade a Pro"
      2. Backend crea Checkout Session con `success_url` y `cancel_url`
      3. Usuario redirigido a Stripe Checkout
      4. Completa pago
      5. Stripe envía webhook `checkout.session.completed`
      6. Backend actualiza `user.plan` y `quota_reset_date`
      7. Usuario redirigido a `success_url` con mensaje "✅ Plan actualizado exitosamente"
    - **Webhook de Stripe:**

    ```typescript
    @Post('webhook')
    async handleWebhook(@Req() request: RawBodyRequest<Request>) {
      const sig = request.headers['stripe-signature'];
      const event = this.stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata.userId;
        // Solo manejar upgrades de plan (sin add-ons)
        await this.updateUserPlan(userId, session.metadata.newPlan);
      }
    }
    ```

    - **UI de Billing:**
      - Página `/billing` mostrando:
        - Plan actual con badge destacado
        - Uso actual: "3/5 proyectos" con progress bar
        - Cards de planes disponibles (con comparación de features)
        - Historial de pagos (últimos 10)
        - Botón "Cancelar suscripción" (solo si tiene plan pago)
      - **Mensaje para usuarios Free que agotaron su cuota:** "Tu proyecto gratuito ha sido consumido. Suscríbete a un plan para crear más proyectos."
    - **Cancelación de Suscripción:**
      - Permitir cancelar desde UI
      - No cancelar inmediatamente, sino al final del período pagado
      - Actualizar `user.plan_cancel_at` (timestamp) y mostrar: "Tu plan Pro estará activo hasta el 15/01/2025"
      - **Al cancelar:** Usuario vuelve a FREE, pero `free_project_used` permanece en `true`, por lo que NO puede crear nuevos proyectos gratuitos
    - **Restricción de Capacidad:**
      - El usuario debe ajustarse estrictamente a los proyectos habilitados por su plan
      - No existe forma de obtener proyectos adicionales fuera de hacer upgrade al siguiente plan

---

## 🛠️ EPIC 7: Herramientas de Productividad (Dev Experience)

### HU-16: Block de Notas Global (Dev Journal)

- **Como** usuario,
- **Quiero** tener un panel de notas accesible desde cualquier pantalla de la aplicación mediante un botón siempre visible,
- **Para** apuntar ideas rápidas, snippets de código, TO-DOs personales o recordatorios sin tener que cambiar de ventana ni salir del dashboard.
  - **Criterios de Aceptación:**
    - **Accesibilidad:**
      - Botón flotante (fixed position, bottom-right) o en el Header principal
      - Icono: 📝 con badge numérico si hay notas sin leer
      - Al click, abre componente `Sheet` (panel lateral deslizante de shadcn/ui) desde la derecha
    - **Interfaz del Journal:**
      - Tabs: `[Global]` `[Proyecto Actual]`
      - Editor: Textarea con Markdown support básico (bold, italic, code blocks)
      - Autoguardado: Debounce de 2 segundos después de dejar de escribir
      - Timestamp: Mostrar "Última edición: hace 5 minutos"
    - **Persistencia Automática:**
      - Tabla `user_notes` con columnas:
        - `user_id`, `project_id` (nullable), `content` (TEXT), `updated_at`
      - Endpoint: `PATCH /notes/:id` llamado automáticamente en cada debounce
      - Usar optimistic update en frontend (actualizar UI antes de confirmar con backend)
    - **Contexto de Notas:**
      - **Notas Globales:** `project_id = NULL`, visibles siempre
      - **Notas de Proyecto:** `project_id = X`, solo visibles cuando ese proyecto está activo
      - Switch en UI para cambiar entre ambos contextos
    - **Límites:**
      - Máximo 50,000 caracteres por nota
      - Máximo 100 notas por usuario
      - Si se excede, mostrar warning: "⚠️ Has alcanzado el límite de notas. Considera archivar notas antiguas."
    - **Features Adicionales (Opcional para MVP+):**
      - Buscar en notas (full-text search)
      - Exportar a Markdown
      - Sintaxis highlighting para code blocks

---

## 📊 EPIC 8: Analytics y Feedback (Post-MVP)

### HU-17: Métricas de Uso del Proyecto

- **Como** usuario,
- **Quiero** ver estadísticas de mi proyecto (tiempo estimado vs real, velocidad de desarrollo, tareas completadas por día),
- **Para** entender mi progreso y mejorar mis estimaciones futuras.
  - **Criterios de Aceptación:**
    - **Dashboard de Métricas:** Sección en la página del proyecto mostrando:
      - Total de tareas: X completadas de Y
      - Tiempo estimado total: suma de `estimated_hours` de todas las tareas
      - Velocidad promedio: tareas completadas / días desde creación
      - Gráfico de burndown (tareas pendientes vs días)
      - Distribución Frontend vs Backend (pie chart)
    - **Tracking de Tiempo Real:**
      - Cuando una tarea se mueve a DOING, registrar `started_at`
      - Cuando se mueve a DONE, registrar `completed_at`
      - Calcular `actual_hours = (completed_at - started_at) / 3600000`
    - **Comparación Estimado vs Real:**
      - Mostrar para cada tarea: "Estimado: 3h | Real: 4.5h | Diferencia: +1.5h"
      - Metric global: % de exactitud de estimaciones

### HU-18: Sistema de Feedback y Mejora Continua

- **Como** usuario,
- **Quiero** poder reportar problemas con las generaciones de IA o sugerir mejoras,
- **Para** ayudar a que el producto evolucione y se adapte mejor a mis necesidades.
  - **Criterios de Aceptación:**
    - **Botón de Feedback:** Presente en cada generación (análisis, historias, tareas)
      - Opciones: 👍 Excelente | 👌 Bueno | 👎 Necesita mejoras
      - Campo opcional: "¿Qué podría mejorar?" (textarea)
    - **Persistencia:**
      - Tabla `feedback` con columnas:
        - `user_id`, `project_id`, `generation_type` (enum: ANALYSIS, STORIES, TASKS), `rating`, `comment`, `created_at`
    - **Dashboard Interno (Admin):**
      - Ver feedback agregado por tipo de generación
      - Identificar patrones de problemas recurrentes
      - Usar para mejorar prompts a Claude

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Fundación (Semanas 1-2)

- [ ] HU-01: Autenticación JWT
- [ ] HU-02: Dashboard de proyectos
- [ ] HU-13: Sistema de cuotas y planes
- [ ] HU-13B: Rate limiting básico

### Fase 2: Pipeline de IA (Semanas 3-5)

- [ ] HU-04: Definición de proyecto
- [ ] HU-05: Análisis con streaming
- [ ] HU-06: Generación de historias
- [ ] HU-07: Refinamiento de historias
- [ ] HU-14: Manejo de errores de IA

### Fase 3: Gestión Técnica (Semanas 6-7)

- [ ] HU-08: Desglose técnico
- [ ] HU-09: Kanban con drag & drop
- [ ] HU-16: Dev journal

### Fase 4: Entregables (Semanas 8-9)

- [ ] HU-10: Generación de docs de gobernanza
- [ ] HU-11: Generación de backlogs con prompts
- [ ] HU-12: Descarga de Context Kit

### Fase 5: Monetización (Semana 10)

- [ ] HU-15: Integración con Stripe
- [ ] HU-03: Tutorial interactivo

### Fase 6: Polish (Semana 11-12)

- [ ] HU-17: Métricas de proyecto
- [ ] HU-18: Sistema de feedback
- [ ] Testing end-to-end
- [ ] Deploy a producción

---

**Total estimado: 12 semanas para MVP completo**
**Costo estimado de desarrollo: $0 (usando Claude para escribir 100% del código)**
**Costo operativo inicial: ~$100/mes (Claude API + Vercel + Supabase)**
