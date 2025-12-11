import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../modules/users/entities';

// Load .env.test for testing data source
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

export const testDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5438', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'genesis_testing_db',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: false,
};

const testDataSource = new DataSource(testDataSourceOptions);

export default testDataSource;
