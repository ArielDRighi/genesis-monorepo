import * as Joi from 'joi';

export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_HOST: string;
  DATABASE_PORT: number;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  JWT_SECRET: string;
  JWT_EXPIRATION: string;
  ANTHROPIC_API_KEY?: string;
  STRIPE_PUBLIC_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  FRONTEND_URL: string;
}

const ENV_SCHEMA = Joi.object<EnvironmentVariables>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development')
    .description('Application environment'),

  PORT: Joi.number().default(3000).description('Application port'),

  DATABASE_HOST: Joi.string().required().description('Database host address'),

  DATABASE_PORT: Joi.number().default(5434).description('Database port'),

  DATABASE_USER: Joi.string().required().description('Database user'),

  DATABASE_PASSWORD: Joi.string().required().description('Database password'),

  DATABASE_NAME: Joi.string().required().description('Database name'),

  JWT_SECRET: Joi.string().min(32).required().description('JWT secret key (minimum 32 characters)'),

  JWT_EXPIRATION: Joi.string().default('7d').description('JWT token expiration time'),

  ANTHROPIC_API_KEY: Joi.string().optional().description('Anthropic API key for AI features'),

  STRIPE_PUBLIC_KEY: Joi.string().optional().description('Stripe public key for billing'),

  STRIPE_SECRET_KEY: Joi.string().optional().description('Stripe secret key for billing'),

  STRIPE_WEBHOOK_SECRET: Joi.string()
    .optional()
    .description('Stripe webhook secret for event verification'),

  FRONTEND_URL: Joi.string()
    .uri()
    .default('http://localhost:3000')
    .description('Frontend URL for CORS configuration'),
});

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const { error, value } = ENV_SCHEMA.validate(config, {
    abortEarly: false,
    allowUnknown: true,
  }) as { error?: Joi.ValidationError; value: EnvironmentVariables };

  if (error) {
    const formattedErrors = error.details
      .map((detail) => {
        const varName = detail.path.join('.');
        return `  - ${varName}: ${detail.message}`;
      })
      .join('\n');
    throw new Error(`Config validation error(s):\n${formattedErrors}`);
  }

  return value;
}
