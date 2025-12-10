# Backend Architecture & Governance

## 1. High-Level Architecture

We follow a **Modular Monolith** architecture using **NestJS**. The application is structured around **Feature Modules**, ensuring separation of concerns and scalability.

-   **Framework**: NestJS (Latest Stable)
-   **Language**: TypeScript (Strict Mode)
-   **Pattern**: Controller-Service-Repository (via TypeORM)

## 2. Directory Structure

The `src` directory is organized as follows:

```
src/
├── app.module.ts           # Root Module
├── main.ts                 # Entry Point
├── common/                 # Shared utilities, unrelated to specific business logic
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── interfaces/
├── config/                 # Configuration and Environment validation
├── database/               # Database related (migrations, seeds, data-source)
└── modules/                # Feature Modules (Domain Logic)
    ├── auth/
    ├── users/
    ├── projects/
    └── ...
```

### Module Structure
Each feature module (e.g., `users`) MUST follow this flat structure for simplicity, unless complexity demands sub-directories:

```
modules/users/
├── dto/                    # Data Transfer Objects (Input/Output validation)
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── entities/               # TypeORM Entities
│   └── user.entity.ts
├── users.controller.ts     # Request handling
├── users.service.ts        # Business logic
├── users.module.ts         # Module definition
└── users.service.spec.ts   # Unit tests
```

## 3. Coding Standards

### 3.1 Naming Conventions
-   **Files**: Kebab-case (`create-user.dto.ts`, `user.entity.ts`).
-   **Classes**: PascalCase (`CreateUserDto`, `UserEntity`, `UsersService`).
-   **Variables/Functions**: camelCase.
-   **Interfaces**: PascalCase, generally without `I` prefix unless necessary for clarity.

### 3.2 TypeScript Configuration
-   **Strict Mode**: Enabled. `noImplicitAny` must be true.
-   **Type Safety**: Avoid `any`. Use interfaces and DTOs.

### 3.3 Data Transfer Objects (DTOs)
-   Must be used for all Controller inputs.
-   Must use `class-validator` decorators for validation.
-   Must use `class-transformer` for transformation if needed.

### 3.4 Dependency Injection
-   Use Constructor Injection.
-   Avoid circular dependencies; use `forwardRef()` only when absolutely necessary.

## 4. Error Handling
-   Use standard HTTP Exceptions (e.g., `NotFoundException`, `BadRequestException`).
-   Do not return raw error objects; use global filters (to be implemented in `common`).

## 5. Testing Strategy
-   **Unit Tests (`.spec.ts`)**: Mandatory for all Services and Controllers. Mock dependencies.
-   **E2E Tests (`test/*.e2e-spec.ts`)**: Mandatory for critical flows. Test the compiled application.
-   **Coverage**: Aim for high coverage on Business Logic (Services).

## 6. Configuration
-   Use `@nestjs/config`.
-   Never hardcode secrets. Use Environment Variables.
-   Validate Environment Variables using `joi` (referenced in TASK-B-005).

## 7. Database
-   Use TypeORM.
-   **Migrations**: All schema changes must be done via migrations. `synchronize: true` is forbidden in production.

## 8. Design Principles (SOLID)

We adhere to **SOLID** principles to ensure maintainability.

### 8.1 Single Responsibility Principle (SRP)
-   **Classes**: A class should have one, and only one, reason to change.
-   **Services**: A Service should handle one business domain (e.g., `UsersService` handles User logic, not Auth logic). Delegate to other services or helpers if logic grows.
-   **Controllers**: Controllers should **only** handle HTTP requests (validation, invocation, response). **NO business logic** in controllers.

### 8.2 Dependency Inversion
-   Depend on abstractions (interfaces), not concretions, where applicable. Use NestJS DI container effectively.

## 9. Code Complexity & Maintenance

### 9.1 File Size Limits (Heuristic)
-   **Soft Limit**: ~300-400 lines per file.
-   **Action**: If a file exceeds this, it is a strong indicator that it breaks SRP.
    -   **Refactor**: Extract logic into Helper Services (e.g., `UserValidationService`) or split the module (e.g., `UserBillingService`).

### 9.2 Function Size
-   Keep methods small and focused.
-   Ideally, a method should fit on a screen (approx. 20-50 lines).

### 9.3 Cognitive Complexity
-   Avoid deep nesting usage (multiple `if/else`, loops).
-   Use **Guard Clauses** (return early) to flatten logic.
