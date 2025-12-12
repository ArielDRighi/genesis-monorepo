import { registerAs } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: string;
  port: number;
}

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
}

export interface JwtConfig {
  secret: string;
  expiration: string;
}

export interface StripeConfig {
  publicKey?: string;
  secretKey?: string;
  webhookSecret?: string;
}

export interface AiConfig {
  anthropicApiKey?: string;
}

export interface CorsConfig {
  frontendUrl: string;
}

export interface Configuration {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  stripe: StripeConfig;
  ai: AiConfig;
  cors: CorsConfig;
}

export const configuration = registerAs(
  'config',
  (): Configuration => ({
    app: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '3000', 10),
    },
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432', 10),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'genesis_db',
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
    },
    jwt: {
      secret: process.env.JWT_SECRET || '',
      expiration: process.env.JWT_EXPIRATION || '7d',
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY,
      secretKey: process.env.STRIPE_SECRET_KEY,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    },
    ai: {
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    },
    cors: {
      frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
  }),
);
