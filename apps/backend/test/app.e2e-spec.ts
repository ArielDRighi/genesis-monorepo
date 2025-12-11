import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { DataSource } from 'typeorm';
import { AppModule } from './../src/app.module';

interface QueryResult {
  value?: number;
  table_name?: string;
}

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    const server = app.getHttpServer() as Server;
    return request(server).get('/health').expect(200).expect({ status: 'ok' });
  });

  describe('Database Connectivity', () => {
    it('should establish database connection successfully', () => {
      const dataSource = app.get(DataSource);
      expect(dataSource).toBeDefined();
      expect(dataSource.isInitialized).toBe(true);
    });

    it('should be able to query the database', async () => {
      const dataSource = app.get(DataSource);
      const result: QueryResult[] = await dataSource.query('SELECT 1 as value');
      expect(result).toBeDefined();
      expect(result[0]?.value).toBe(1);
    });

    it('should have users table available', async () => {
      const dataSource = app.get(DataSource);
      const tables: QueryResult[] = await dataSource.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'users'
      `);
      expect(tables).toHaveLength(1);
      expect(tables[0]?.table_name).toBe('users');
    });
  });
});
