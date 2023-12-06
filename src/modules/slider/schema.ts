import { z } from 'zod';

export const createSliderSchema = z.object({
  title: z.string().max(30).optional(),
  imgUrl: z.string().url(),
  link: z.string().optional(),
  showTitle: z.boolean(),
  status: z.enum(['active', 'hidden']).optional().default('active'),
  type: z.enum(['mobile', 'desktop']),
});

const params = {
  params: z.object({
    id: z.string({
      required_error: 'id is required',
    }),
  }),
};

export const updateSliderSchema = createSliderSchema.extend({
  sort: z.number().min(0),
});

export const updateSliderIdSchema = z.object({
  ...params,
});

export type CreateSliderInputs = z.infer<typeof createSliderSchema>;

export type UpdateSliderInputs = z.infer<typeof updateSliderSchema>;
export type SliderId = z.infer<typeof updateSliderIdSchema>['params'];
