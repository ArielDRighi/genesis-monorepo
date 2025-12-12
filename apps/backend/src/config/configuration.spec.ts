import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './env.validation';
import { configuration } from './configuration';

describe('Configuration', () => {
  describe('Environment Validation', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should fail when JWT_SECRET is missing', () => {
      process.env = {
        NODE_ENV: 'development',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'postgres',
        DATABASE_PASSWORD: 'postgres',
        DATABASE_NAME: 'test_db',
      };

      expect(() => validate(process.env)).toThrow();
      expect(() => validate(process.env)).toThrow(/JWT_SECRET/);
    });

    it('should fail when DATABASE_HOST is missing', () => {
      process.env = {
        NODE_ENV: 'development',
        JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'postgres',
        DATABASE_PASSWORD: 'postgres',
        DATABASE_NAME: 'test_db',
      };

      expect(() => validate(process.env)).toThrow();
      expect(() => validate(process.env)).toThrow(/DATABASE_HOST/);
    });

    it('should fail when DATABASE_PASSWORD is missing', () => {
      process.env = {
        NODE_ENV: 'development',
        JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'postgres',
        DATABASE_NAME: 'test_db',
      };

      expect(() => validate(process.env)).toThrow();
      expect(() => validate(process.env)).toThrow(/DATABASE_PASSWORD/);
    });

    it('should fail when JWT_SECRET is less than 32 characters', () => {
      process.env = {
        NODE_ENV: 'development',
        JWT_SECRET: 'short-secret',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'postgres',
        DATABASE_PASSWORD: 'postgres',
        DATABASE_NAME: 'test_db',
      };

      expect(() => validate(process.env)).toThrow();
      expect(() => validate(process.env)).toThrow(/JWT_SECRET/);
    });

    it('should pass with all required variables', () => {
      process.env = {
        NODE_ENV: 'development',
        PORT: '3000',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'postgres',
        DATABASE_PASSWORD: 'postgres',
        DATABASE_NAME: 'test_db',
        JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
        JWT_EXPIRATION: '7d',
        FRONTEND_URL: 'http://localhost:3000',
      };

      expect(() => validate(process.env)).not.toThrow();
    });

    it('should apply default values correctly', () => {
      process.env = {
        NODE_ENV: 'development',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'postgres',
        DATABASE_PASSWORD: 'postgres',
        DATABASE_NAME: 'test_db',
        JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
      };

      const result = validate(process.env);
      expect(result.PORT).toBe(3000);
      expect(result.JWT_EXPIRATION).toBe('7d');
    });

    it('should accept valid NODE_ENV values', () => {
      const validEnvs = ['development', 'production', 'test'];

      validEnvs.forEach((env) => {
        process.env = {
          NODE_ENV: env,
          PORT: '3000',
          DATABASE_HOST: 'localhost',
          DATABASE_PORT: '5432',
          DATABASE_USER: 'postgres',
          DATABASE_PASSWORD: 'postgres',
          DATABASE_NAME: 'test_db',
          JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
        };

        expect(() => validate(process.env)).not.toThrow();
      });
    });

    it('should fail with invalid NODE_ENV value', () => {
      process.env = {
        NODE_ENV: 'staging',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'postgres',
        DATABASE_PASSWORD: 'postgres',
        DATABASE_NAME: 'test_db',
        JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
      };

      expect(() => validate(process.env)).toThrow();
    });
  });

  describe('ConfigService with typed configuration', () => {
    let configService: ConfigService;

    beforeEach(async () => {
      process.env = {
        NODE_ENV: 'test',
        PORT: '3000',
        DATABASE_HOST: 'localhost',
        DATABASE_PORT: '5432',
        DATABASE_USER: 'postgres',
        DATABASE_PASSWORD: 'postgres',
        DATABASE_NAME: 'test_db',
        JWT_SECRET: 'test-secret-key-with-at-least-32-characters',
        JWT_EXPIRATION: '7d',
        FRONTEND_URL: 'http://localhost:3000',
      };

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            load: [configuration],
            validate,
          }),
        ],
      }).compile();

      configService = module.get<ConfigService>(ConfigService);
    });

    it('should return typed values from ConfigService', () => {
      expect(configService.get<string>('config.app.nodeEnv')).toBe('test');
      expect(configService.get<number>('config.app.port')).toBe(3000);
      expect(configService.get<string>('config.database.host')).toBe('localhost');
      expect(configService.get<number>('config.database.port')).toBe(5432);
      expect(configService.get<string>('config.jwt.secret')).toBe(
        'test-secret-key-with-at-least-32-characters',
      );
      expect(configService.get<string>('config.jwt.expiration')).toBe('7d');
    });

    it('should return correct types, not any', () => {
      const port = configService.get<number>('config.app.port');
      expect(typeof port).toBe('number');

      const secret = configService.get<string>('config.jwt.secret');
      expect(typeof secret).toBe('string');
    });
  });
});
