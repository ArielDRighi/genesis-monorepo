/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/users/users.module';
import { User } from '../src/modules/users/entities/user.entity';

describe('Users E2E Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    // Configurar JWT_SECRET para tests si no está definido
    if (!process.env.JWT_SECRET) {
      process.env.JWT_SECRET = 'test-secret-key-for-e2e-tests';
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST || process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || process.env.DB_PORT || '5432', 10),
          username: process.env.DATABASE_USER || process.env.DB_USERNAME || 'postgres',
          password: process.env.DATABASE_PASSWORD || process.env.DB_PASSWORD || 'postgres',
          database: process.env.DATABASE_NAME || process.env.DB_NAME || 'genesis_testing_db',
          entities: [User],
          synchronize: true,
          dropSchema: true,
        }),
        AuthModule,
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    // Limpiar la tabla users antes de cada test
    await dataSource.getRepository(User).clear();

    // Registrar un usuario de prueba y obtener token
    const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    authToken = registerResponse.body.access_token;
    userId = registerResponse.body.user.id;
  });

  describe('GET /users/me', () => {
    it('should return current user data with plan info', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', userId);
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
      expect(response.body).toHaveProperty('plan', 'FREE');
      expect(response.body).toHaveProperty('projectsCount', 0);
      expect(response.body).toHaveProperty('freeProjectUsed', false);
      expect(response.body).toHaveProperty('quotaResetDate');
      expect(response.body).toHaveProperty('hasCompletedOnboarding', false);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('should return 401 with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('PATCH /users/me', () => {
    it('should update user profile with allowed fields', async () => {
      const updateDto = {
        hasCompletedOnboarding: true,
      };

      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateDto)
        .expect(200);

      expect(response.body).toHaveProperty('hasCompletedOnboarding', true);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 when not authenticated', async () => {
      await request(app.getHttpServer())
        .patch('/users/me')
        .send({ hasCompletedOnboarding: true })
        .expect(401);
    });

    it('should return 400 with invalid data type', async () => {
      const response = await request(app.getHttpServer())
        .patch('/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ hasCompletedOnboarding: 'invalid-boolean' })
        .expect(400);

      // message es un array de strings con los mensajes de validación
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message[0]).toContain('boolean');
    });
  });
});
