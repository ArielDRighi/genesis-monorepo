# Backend Governance: Naming Conventions

## 1. General Rules

| Element | Case Style | Example |
| :--- | :--- | :--- |
| **Files** | `kebab-case` | `auth.service.ts` |
| **Directories** | `kebab-case` | `user-profile/` |
| **Classes** | `PascalCase` | `AuthService` |
| **Methods** | `camelCase` | `validateUser` |
| **Properties** | `camelCase` | `firstName` |
| **Variables** | `camelCase` | `userCount` |
| **Constants** | `UPPER_SNAKE_CASE` | `MAX_RETRIES` |
| **Enums** | `PascalCase` | `UserRole` |

## 2. NestJS Specifics

### 2.1 Suffixes
All NestJS components must include their type as a suffix in both the filename and class name.

| Type | Filename Suffix | Class Suffix | Example |
| :--- | :--- | :--- | :--- |
| **Module** | `.module.ts` | `Module` | `UsersModule` |
| **Controller** | `.controller.ts` | `Controller` | `UsersController` |
| **Service** | `.service.ts` | `Service` | `UsersService` |
| **Guard** | `.guard.ts` | `Guard` | `JwtAuthGuard` |
| **Interceptor** | `.interceptor.ts` | `Interceptor` | `LoggingInterceptor` |
| **Pipe** | `.pipe.ts` | `Pipe` | `ValidationPipe` |
| **Filter** | `.filter.ts` | `Filter` | `HttpExceptionFilter` |
| **Middleware** | `.middleware.ts` | `Middleware` | `LoggerMiddleware` |
| **Decorator** | `.decorator.ts` | N/A (Function) | `CurrentUser` |
| **Strategy** | `.strategy.ts` | `Strategy` | `JwtStrategy` |

### 2.2 DTOs (Data Transfer Objects)
-   **Filename**: `*.dto.ts` (e.g., `create-user.dto.ts`)
-   **Class Name**: `ActionResourceDto` (e.g., `CreateUserDto`)

### 2.3 Entities
-   **Filename**: `*.entity.ts` (e.g., `user.entity.ts`)
-   **Class Name**: `ResourceEntity` or `Resource` (e.g., `UserEntity` or `User`)

## 3. TypeScript Guidelines

### 3.1 Interfaces
-   **Naming**: `PascalCase`.
-   **Prefix**: DO NOT use `I` prefix (e.g., use `UserData`, not `IUserData`).
-   **Filename**: `*.interface.ts` (e.g., `user-data.interface.ts`).

### 3.2 Types
-   **Naming**: `PascalCase`.
-   **Filename**: `*.type.ts` (e.g., `auth-response.type.ts`).

### 3.3 Booleans
Boolean variables or properties should verify a condition and be prefixed with:
-   `is` (e.g., `isActive`)
-   `has` (e.g., `hasRole`)
-   `should` (e.g., `shouldRetry`)

### 3.4 Generics
-   Use `T` for generic type parameter.
-   If multiple generics or needed for clarity, use `T` + Name (e.g., `TUser`, `TResponse`).

## 4. Testing Files

| Type | Filename Pattern |
| :--- | :--- |
| **Unit Test** | `*.spec.ts` |
| **E2E Test** | `*.e2e-spec.ts` |

## 5. API Endpoints
-   **URIs**: `kebab-case`, plural nouns (e.g., `/users`, `/project-settings`).
-   Avoid verbs in URIs (e.g., use `POST /users` instead of `/create-user`).
