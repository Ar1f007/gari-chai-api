import { z } from 'zod';
import { imageSchema } from '../../utils/helperSchema';

const payload = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().nonnegative(),
    stock: z.number().nonnegative(),
    status: z.boolean(),
    warranty: z.string().optional(),
    manufacturer: z.string().optional(),
    description: z.string().nullable(),
    posterImage: imageSchema,
    imageUrls: z
      .array(
        z.object({
          key: z.string(),
          url: imageSchema,
        }),
      )
      .optional()
      .default([]),
  }),

  metaData: z.record(z.string().min(1), z.any()).optional().default({}),
};

export const createCarPartSchema = z.object({
  ...payload,
});

export type CreateCarPartInputs = z.infer<typeof createCarPartSchema>['body'];
