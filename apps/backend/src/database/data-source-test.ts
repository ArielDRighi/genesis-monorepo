import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { entities, getMigrationPaths, parsePort } from './database.utils';

// Load .env.test for testing data source
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

export const testDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
  port: parsePort(process.env.DATABASE_PORT || process.env.DB_PORT, 5438),
  username: process.env.DATABASE_USER || process.env.DB_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || process.env.DB_NAME || 'genesis_testing_db',
  entities,
  migrations: getMigrationPaths(),
  synchronize: false,
  logging: false,
};

const testDataSource = new DataSource(testDataSourceOptions);

export default testDataSource;
