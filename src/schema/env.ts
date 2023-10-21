import dotenv from 'dotenv';

dotenv.config();

import { z } from 'zod';
import logger from '../utils/logger';

const envSchema = z.object({
  PORT: z.string().default('8000'),
  DB_URI: z.string().min(1),
});

export const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error(parsedEnv.error.issues);

  throw new Error('There is an error with the environment variables');
}

export const envVariables = parsedEnv.data;
