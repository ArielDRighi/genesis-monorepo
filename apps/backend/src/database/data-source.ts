import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../modules/users/entities';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'genesis_db',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
