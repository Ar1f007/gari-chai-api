import { z } from 'zod';

export const createSliderSchema = z.object({
  title: z.string().max(30).optional(),
  imgUrl: z.string().url(),
  link: z.string().optional(),
  showTitle: z.boolean(),
  status: z.enum(['active', 'hidden']).optional().default('active'),
  type: z.enum(['mobile', 'desktop']),
});

export type CreateSliderInputs = z.infer<typeof createSliderSchema>;
