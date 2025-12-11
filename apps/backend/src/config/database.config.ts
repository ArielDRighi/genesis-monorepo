import { registerAs } from '@nestjs/config';
import { parsePort } from '../database/database.utils';

// WARNING: Never use the default password 'postgres' in production!
export const databaseConfig = registerAs('database', () => {
  const password = process.env.DB_PASSWORD || 'postgres';

  if (process.env.NODE_ENV === 'production' && password === 'postgres') {
    throw new Error(
      "Database password is set to the default 'postgres' in production. " +
        'Set a strong DB_PASSWORD environment variable.',
    );
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parsePort(process.env.DB_PORT, 5434),
    username: process.env.DB_USERNAME || 'postgres',
    password,
    database: process.env.DB_NAME || 'genesis_db',
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
  };
});
