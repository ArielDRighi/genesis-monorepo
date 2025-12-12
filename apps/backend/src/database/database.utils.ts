import { User } from '../modules/users/entities';

/**
 * Validates and parses a port number from string
 * @param portStr - Port string from environment variable
 * @param defaultPort - Default port if invalid or missing
 * @returns Valid port number between 1-65535
 */
export function parsePort(portStr: string | undefined, defaultPort: number): number {
  const port = parseInt(portStr || '', 10);
  if (Number.isInteger(port) && port >= 1 && port <= 65535) {
    return port;
  }
  return defaultPort;
}

/**
 * All entities registered in the application
 * Single source of truth for TypeORM entity registration
 */
export const entities = [User];

/**
 * Migration paths configuration
 * Uses TypeScript files in development, JavaScript in production
 */
export function getMigrationPaths(): string[] {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  return isDevelopment ? ['src/migrations/*.ts'] : ['dist/migrations/*.js'];
}
