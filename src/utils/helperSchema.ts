import { z } from 'zod';

export const imageSchema = z.object({
  thumbnailUrl: z.string().optional(),
  originalUrl: z.string().optional(),
});
