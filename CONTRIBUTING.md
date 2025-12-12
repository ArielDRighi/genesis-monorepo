# 🤝 Guía de Contribución - GENESIS

¡Gracias por tu interés en contribuir a GENESIS! Esta guía te ayudará a entender nuestro flujo de trabajo y estándares.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
- [Estrategia de Ramas (Gitflow)](#estrategia-de-ramas-gitflow)
- [Convenciones de Commits](#convenciones-de-commits)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Arquitectura y Patrones](#arquitectura-y-patrones)
- [Testing](#testing)

## 📜 Código de Conducta

Esperamos que todos los contribuyentes:

- Sean respetuosos y profesionales
- Acepten críticas constructivas
- Se enfoquen en lo mejor para el proyecto
- Muestren empatía hacia otros miembros del equipo

## 🌳 Flujo de Trabajo con Git

### Estrategia de Ramas (Gitflow)

Utilizamos **Gitflow** como estrategia de branching:

```
main (producción)
  ↑
  └─ release/v1.0.0
       ↑
develop (desarrollo)
  ↑
  ├─ feature/TASK-B-001-auth-module
  ├─ feature/TASK-B-002-projects-module
  ├─ bugfix/fix-login-error
  └─ ...
```

### Ramas Principales

#### `main`

- **Propósito**: Código en producción
- **Estabilidad**: Siempre estable y deployable
- **Protección**: Solo se actualiza mediante merges desde `release/*` o `hotfix/*`
- **Tags**: Cada merge recibe un tag de versión (v1.0.0, v1.1.0, etc.)

#### `develop`

- **Propósito**: Rama de integración para desarrollo
- **Estabilidad**: Debe estar siempre funcional (todos los tests pasando)
- **Protección**: Requiere PR aprobado y CI pasando

### Ramas Temporales

#### `feature/*`

- **Propósito**: Desarrollo de nuevas características
- **Base**: Se crea desde `develop`
- **Destino**: Se mergea a `develop`
- **Nomenclatura**: `feature/TASK-B-XXX-descripcion-corta`
- **Ejemplos**:
  - `feature/TASK-B-001-auth-module`
  - `feature/TASK-B-005-ai-integration`
  - `feature/add-email-notifications`

#### `bugfix/*`

- **Propósito**: Corrección de bugs en desarrollo
- **Base**: Se crea desde `develop`
- **Destino**: Se mergea a `develop`
- **Nomenclatura**: `bugfix/descripcion-del-bug`
- **Ejemplos**:
  - `bugfix/fix-jwt-expiration`
  - `bugfix/cors-configuration`

#### `hotfix/*`

- **Propósito**: Correcciones urgentes en producción
- **Base**: Se crea desde `main`
- **Destino**: Se mergea a `main` Y `develop`
- **Nomenclatura**: `hotfix/v1.0.1-descripcion`
- **Ejemplos**:
  - `hotfix/v1.0.1-security-patch`
  - `hotfix/v1.0.2-critical-bug`

#### `release/*`

- **Propósito**: Preparación de un release
- **Base**: Se crea desde `develop`
- **Destino**: Se mergea a `main` y `develop`
- **Nomenclatura**: `release/v1.0.0`
- **Tareas**: Bug fixes menores, actualización de versión, documentación

## 🔄 Flujo de Trabajo Paso a Paso

### 1. Crear una nueva feature

```bash
# Asegurarte de estar en develop actualizado
git checkout develop
git pull origin develop

# Crear rama feature
git checkout -b feature/TASK-B-XXX-descripcion

# Trabajar en tu feature...
git add .
git commit -m "feat(module): add new functionality"

# Push a tu rama
git push origin feature/TASK-B-XXX-descripcion
```

### 2. Mantener la rama actualizada

```bash
# Obtener cambios de develop
git checkout develop
git pull origin develop

# Volver a tu feature y hacer rebase
git checkout feature/TASK-B-XXX-descripcion
git rebase develop

# Si hay conflictos, resolverlos y continuar
git add .
git rebase --continue

# Force push (solo en ramas feature propias)
git push -f origin feature/TASK-B-XXX-descripcion
```

### 3. Crear Pull Request

1. Asegúrate de que todos los tests pasen localmente
2. Ve a GitHub y crea un Pull Request desde tu rama hacia `develop`
3. Completa la plantilla del PR
4. Espera aprobación y CI passing
5. Haz merge (preferiblemente usando "Squash and merge")

## 📝 Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

### Formato

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos

| Tipo       | Descripción              | Ejemplo                                      |
| ---------- | ------------------------ | -------------------------------------------- |
| `feat`     | Nueva característica     | `feat(auth): add JWT authentication`         |
| `fix`      | Corrección de bug        | `fix(users): resolve email validation bug`   |
| `docs`     | Solo documentación       | `docs: update README installation steps`     |
| `style`    | Formato, espacios, etc.  | `style: format code with prettier`           |
| `refactor` | Refactorización          | `refactor(projects): simplify service logic` |
| `test`     | Añadir o modificar tests | `test(auth): add login controller tests`     |
| `chore`    | Tareas de mantenimiento  | `chore: update dependencies`                 |
| `perf`     | Mejoras de rendimiento   | `perf(db): optimize query performance`       |
| `ci`       | Cambios en CI/CD         | `ci: add coverage reporting`                 |
| `build`    | Cambios en build         | `build: update webpack config`               |
| `revert`   | Revertir un commit       | `revert: revert "feat(auth): add OAuth"`     |

### Alcance (Opcional)

El alcance especifica qué parte del código se ve afectada:

- `auth`, `users`, `projects`, `stories`, `tasks`, `ai`, `billing`, `health`
- `db`, `api`, `config`, `common`

### Ejemplos

```bash
# Feature
git commit -m "feat(auth): implement JWT authentication strategy"

# Bug fix
git commit -m "fix(users): resolve unique email constraint error"

# Documentation
git commit -m "docs: add API endpoints documentation"

# Test
git commit -m "test(projects): add service unit tests"

# Refactor
git commit -m "refactor(auth): extract validation logic to separate service"

# Chore
git commit -m "chore(deps): update NestJS to v11"
```

### Breaking Changes

Si introduces un cambio incompatible:

```bash
git commit -m "feat(api)!: change user endpoint response format

BREAKING CHANGE: User endpoint now returns camelCase instead of snake_case
```

## 🎯 Estándares de Código

### Arquitectura

**Lee PRIMERO la documentación de arquitectura:**

- [docs/backend/ARCHITECTURE.md](docs/backend/ARCHITECTURE.md)
- [docs/backend/NAMING_CONVENTIONS.md](docs/backend/NAMING_CONVENTIONS.md)

### Reglas Principales

1. **Feature-based Architecture**: Cada módulo es independiente
2. **Estructura plana**: Evita anidamiento excesivo
3. **SOLID principles**: Responsabilidad única, etc.
4. **DRY**: No te repitas
5. **KISS**: Keep it simple

### TypeScript

```typescript
// ✅ BIEN - Tipos explícitos
async findById(id: string): Promise<User> {
  return this.userRepository.findOne({ where: { id } });
}

// ❌ MAL - Sin tipos
async findById(id) {
  return this.userRepository.findOne({ where: { id } });
}
```

### Nomenclatura

```typescript
// Archivos
user.service.ts          // ✅ kebab-case
UserService.ts           // ❌ PascalCase

// Clases
export class UsersService  // ✅ PascalCase
export class usersService  // ❌ camelCase

// Métodos
async createUser()       // ✅ camelCase
async CreateUser()       // ❌ PascalCase

// Constantes
const MAX_RETRIES = 3    // ✅ UPPER_SNAKE_CASE
const maxRetries = 3     // ❌ camelCase
```

### Inyección de Dependencias

```typescript
// ✅ BIEN - Inyección correcta
constructor(
  @InjectRepository(User)
  private readonly userRepository: Repository<User>,
) {}

// ❌ MAL - Instanciación directa
constructor() {
  this.userRepository = new Repository();
}
```

## ✅ Checklist de Calidad (Pre-Commit)

Antes de hacer commit, **SIEMPRE** ejecuta:

```bash
cd apps/backend

# 0. Validar reglas de arquitectura
npm run check:governance

# 1. Lint y formato
npm run lint
npm run format

# 2. Type check
npm run typecheck

# 3. Build
npm run build

# 4. Tests
npm run test
npm run test:e2e

# 5. Validación completa
npm run validate
```

**PROHIBIDO:**

- ❌ Usar `// eslint-disable` sin justificación
- ❌ Commits con tests fallando
- ❌ Commits con errores de TypeScript
- ❌ Código sin formatear

## 🔄 Proceso de Pull Request

### Antes de crear el PR

1. ✅ Todos los tests pasan localmente
2. ✅ Código formateado (Prettier)
3. ✅ Sin errores de ESLint
4. ✅ Build exitoso
5. ✅ Rama actualizada con `develop`

### Crear el PR

1. **Título**: Sigue Conventional Commits
   - ✅ `feat(auth): add Google OAuth integration`
   - ❌ `added oauth`

2. **Descripción**: Usa la plantilla

   ```markdown
   ## 📋 Descripción

   Breve descripción del cambio

   ## 🔗 Issue relacionado

   Closes #123

   ## 🧪 Tests

   - [ ] Unit tests
   - [ ] E2E tests

   ## ✅ Checklist

   - [ ] Código revisado
   - [ ] Tests pasando
   - [ ] Documentación actualizada
   ```

3. **Labels**: Asigna labels apropiados
   - `feat`, `fix`, `docs`, `refactor`, etc.
   - `priority: high`, `priority: medium`, `priority: low`

### Durante la revisión

- ✅ Responde a comentarios constructivamente
- ✅ Haz cambios solicitados en commits separados
- ✅ Marca conversaciones como resueltas cuando corresponda
- ✅ Mantén la rama actualizada con `develop`

### Después de la aprobación

1. **Squash and Merge** (recomendado para features pequeños)
2. **Merge Commit** (para features grandes con historia importante)
3. **Rebase and Merge** (para mantener historia lineal)

## 🧪 Testing

### Cobertura Requerida

- **Mínimo**: 80% de cobertura
- **Objetivo**: 90%+ de cobertura

### Tipos de Tests

#### 1. Unit Tests

```typescript
// users.service.spec.ts
describe('UsersService', () => {
  it('should create a user', async () => {
    const dto: CreateUserDto = { email: 'test@test.com', ... };
    const result = await service.create(dto);
    expect(result).toBeDefined();
    expect(result.email).toBe(dto.email);
  });
});
```

#### 2. E2E Tests

```typescript
// auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', ... })
      .expect(201);
  });
});
```

### TDD (Test-Driven Development)

Seguimos un ciclo TDD estricto:

1. 🔴 **Red**: Escribe un test que falle
2. 🟢 **Green**: Escribe el código mínimo para que pase
3. 🔵 **Refactor**: Mejora el código manteniendo tests verdes

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

## ❓ Preguntas

Si tienes preguntas:

1. Revisa la documentación existente
2. Busca en issues cerrados
3. Pregunta en Discord/Slack del equipo
4. Crea un issue con la etiqueta `question`

---

¡Gracias por contribuir a GENESIS! 🚀
