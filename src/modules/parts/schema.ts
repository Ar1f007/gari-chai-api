import { z } from 'zod';
import { imageSchema, sortSchema } from '../../utils/helperSchema';

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

const query = {
  query: z.object({
    name: z.string(),
    page: z.string().refine((val) => !isNaN(Number(val)), { message: 'Page value should be of type number' }),
    limit: z.string().refine((val) => !isNaN(Number(val)), { message: 'Page limit should be of type number' }),
    sort: sortSchema,
    budget: z.string().refine(
      (val) => {
        if (!val.includes('-')) return false;

        const values = val.split('-');

        return values.every((num) => !isNaN(Number(num)));
      },
      {
        message: "Invalid budget type, value must be separated by '-', and range value should be of type number",
      },
    ),
  }),
};

export const createCarPartSchema = z.object({
  ...payload,
});

export const getCarPartQuerySchema = z.object({
  ...query,
});

export type CreateCarPartInputs = z.infer<typeof createCarPartSchema>['body'];
export type GetCarPartsQueryInput = z.infer<typeof getCarPartQuerySchema>;
