import { z } from 'zod';

export const createSliderSchema = z.object({
  title: z.string().max(30).optional(),
  sliderImg: z.string().url(),
  sliderLink: z.string().optional(),
  showTitle: z.boolean(),
  sliderStatus: z.enum(['show', 'hide']).optional().default('show'),
});

export type CreateSliderInputs = z.infer<typeof createSliderSchema>;
