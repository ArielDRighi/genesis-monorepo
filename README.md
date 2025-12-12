# 🚀 GENESIS - Sistema de Gestión de Proyectos con IA

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

## 📋 Descripción

GENESIS es un sistema de gestión de proyectos potenciado por IA que permite a los equipos planificar, ejecutar y dar seguimiento a sus proyectos de manera eficiente. Utiliza inteligencia artificial para generar historias de usuario, estimaciones y recomendaciones.

### 🌟 Características principales

- 🔐 **Autenticación JWT**: Sistema seguro de autenticación y autorización
- 👥 **Gestión de Usuarios**: Registro, login y administración de perfiles
- 📊 **Proyectos**: Creación y gestión de proyectos con estados y miembros
- 📝 **Historias de Usuario**: Generación automática con IA
- ✅ **Tareas**: Sistema completo de gestión de tareas
- 🤖 **IA Integrada**: Asistente IA para generación de contenido
- 💳 **Billing**: Sistema de suscripciones con Stripe (próximamente)

## 🛠️ Tecnologías

### Backend

- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.7+
- **Base de Datos**: PostgreSQL 15+
- **ORM**: TypeORM 0.3.x
- **Autenticación**: JWT (Passport)
- **Validación**: class-validator, class-transformer
- **Testing**: Jest

### DevOps

- **CI/CD**: GitHub Actions
- **Contenedores**: Docker, Docker Compose
- **Linting**: ESLint 9.x
- **Formato**: Prettier 3.x

## 📋 Requisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: 20.x o superior
- **npm**: 10.x o superior
- **PostgreSQL**: 15.x o superior
- **Docker** (opcional): Para desarrollo con contenedores
- **Git**: Para control de versiones

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ArielDRighi/genesis-monorepo.git
cd genesis-monorepo
```

### 2. Instalar dependencias

```bash
# Desde la raíz del monorepo
cd apps/backend
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en `apps/backend/`:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=genesis_user
DATABASE_PASSWORD=genesis_password
DATABASE_NAME=genesis_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRATION=7d

# AI (Anthropic Claude)
ANTHROPIC_API_KEY=your-anthropic-api-key

# Stripe (para módulo de billing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
```

### 4. Configurar base de datos

#### Opción A: Con Docker (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d postgres
```

#### Opción B: PostgreSQL local

```bash
# Crear base de datos
createdb genesis_db

# O con psql
psql -U postgres
CREATE DATABASE genesis_db;
```

### 5. Ejecutar migraciones

```bash
cd apps/backend
npm run migration:run
```

### 6. Iniciar el servidor

```bash
# Modo desarrollo (con watch)
npm run dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3000`

## 📦 Scripts disponibles

### Backend (`apps/backend`)

```bash
# Desarrollo
npm run dev              # Inicia servidor en modo watch
npm run start:debug      # Inicia servidor en modo debug

# Build
npm run build            # Compila el proyecto

# Tests
npm run test             # Ejecuta tests unitarios
npm run test:watch       # Tests en modo watch
npm run test:cov         # Tests con cobertura
npm run test:e2e         # Tests end-to-end

# Calidad de código
npm run lint             # Ejecuta ESLint (con auto-fix)
npm run format           # Formatea código con Prettier
npm run format:check     # Verifica formato sin modificar
npm run typecheck        # Verifica tipos TypeScript
npm run check:governance # Valida reglas de arquitectura
npm run validate         # Ejecuta todas las validaciones

# Base de datos
npm run typeorm          # CLI de TypeORM
npm run migration:generate -- src/migrations/MigrationName
npm run migration:run    # Ejecuta migraciones pendientes
npm run migration:revert # Revierte última migración
npm run migration:show   # Muestra estado de migraciones
```

## 🧪 Testing

### Tests Unitarios

```bash
cd apps/backend
npm run test
```

### Tests E2E

```bash
# Asegúrate de tener PostgreSQL corriendo
npm run test:e2e
```

### Cobertura

```bash
npm run test:cov
```

Los reportes de cobertura se generan en `apps/backend/coverage/`

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura modular** basada en NestJS:

```
apps/backend/src/
├── app.module.ts           # Módulo raíz
├── main.ts                 # Punto de entrada
├── common/                 # Utilidades compartidas
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── config/                 # Configuración y validación
├── database/               # Migraciones y configuración DB
└── modules/                # Módulos de negocio
    ├── auth/               # Autenticación y autorización
    ├── users/              # Gestión de usuarios
    ├── projects/           # Gestión de proyectos
    ├── stories/            # Historias de usuario
    ├── tasks/              # Gestión de tareas
    ├── ai/                 # Integración con IA
    ├── billing/            # Suscripciones y pagos
    └── health/             # Health checks
```

### Principios de diseño

- **Modular**: Cada feature es un módulo independiente
- **SOLID**: Código limpio y mantenible
- **TDD**: Test-Driven Development
- **DDD**: Domain-Driven Design en módulos complejos

Para más detalles, consulta:

- [Arquitectura del Backend](docs/backend/ARCHITECTURE.md)
- [Convenciones de Nomenclatura](docs/backend/NAMING_CONVENTIONS.md)

## 🔒 Seguridad

- 🔐 Autenticación basada en JWT
- 🔑 Passwords hasheados con bcrypt
- ✅ Validación de datos con class-validator
- 🛡️ Guards de NestJS para protección de rutas
- 🔍 Variables de entorno para secretos

## 📚 API Documentation

Una vez iniciado el servidor, la documentación de la API estará disponible en:

- **Swagger UI**: `http://localhost:3000/api` (próximamente)
- **Health Check**: `http://localhost:3000/health`

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor, lee nuestras [guías de contribución](CONTRIBUTING.md) antes de enviar un PR.

### Flujo de trabajo

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/amazing-feature`)
3. Commit tus cambios (`git commit -m 'feat: add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

### Estándares de código

- ✅ Todos los tests deben pasar
- ✅ Cobertura de código > 80%
- ✅ Sin errores de ESLint
- ✅ Código formateado con Prettier
- ✅ Commits siguiendo Conventional Commits

## 📝 Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Nueva característica
fix: Corrección de bug
docs: Cambios en documentación
style: Formato, punto y coma, etc.
refactor: Refactorización de código
test: Añadir o corregir tests
chore: Tareas de mantenimiento
perf: Mejoras de rendimiento
```

## 🌳 Estrategia de Ramas (Gitflow)

- `main`: Producción estable
- `develop`: Desarrollo activo
- `feature/*`: Nuevas características
- `bugfix/*`: Corrección de bugs
- `hotfix/*`: Correcciones urgentes en producción
- `release/*`: Preparación de releases

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

Desarrollado con ❤️ por el equipo de GENESIS

## 📞 Soporte

Para preguntas o soporte:

- Issues: [GitHub Issues](https://github.com/ArielDRighi/genesis-monorepo/issues)
- Pull Requests: [Contribuciones bienvenidas](https://github.com/ArielDRighi/genesis-monorepo/pulls)

---

⭐ Si este proyecto te resulta útil, considera darle una estrella en GitHub
