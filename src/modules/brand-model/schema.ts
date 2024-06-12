import { z } from 'zod';
import { validMongoIdSchema } from '../../lib/zod/commonSchemas';

const payload = {
  body: z.object({
    brand: validMongoIdSchema,
    name: z.string().min(1),
    upcoming: z.boolean(),
  }),
};

const params = {
  params: z.object({
    id: validMongoIdSchema,
  }),
};

const query = {
  query: z.object({
    get: z.string().optional(),
    transform: z.string().optional(),
  }),
};

export const createBrandModelSchema = z.object({
  ...payload,
});

export const updateBrandModelSchema = z.object({
  ...params,
  ...payload,
});

export const deleteBrandModelSchema = z.object({
  ...params,
});

export const getBrandModelSchema = z.object({
  ...params,
  ...query,
});

export type CreateNewBrandModelInputs = z.infer<typeof createBrandModelSchema>['body'];
export type ReadBrandModelInput = z.infer<typeof getBrandModelSchema>;
export type UpdateBrandModelInput = z.infer<typeof updateBrandModelSchema>;
export type DeleteBrandModelInput = z.infer<typeof deleteBrandModelSchema>;
