import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { entities, getMigrationPaths, parsePort } from './database.utils';

// Load .env.test for testing data source
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

export const testDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parsePort(process.env.DB_PORT, 5438),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'genesis_testing_db',
  entities,
  migrations: getMigrationPaths(),
  synchronize: false,
  logging: false,
};

const testDataSource = new DataSource(testDataSourceOptions);

export default testDataSource;
