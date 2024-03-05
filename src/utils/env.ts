import dotenv from 'dotenv';

dotenv.config();

import { z } from 'zod';
import logger from './logger';

const envSchema = z.object({
  PORT: z.string().default('8000'),
  DB_URI: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  JWT_SECRET_KEY: z.string(),
  JWT_LIFETIME: z.string(),
  SENDGRID_API_KEY: z.string(),
  APP_PASSWORD: z.string(),
  APP_EMAIL: z.string(),
});

export const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(parsedEnv.error.issues);

  throw new Error('There is an error with the environment variables');
}

export const envVariables = parsedEnv.data;
