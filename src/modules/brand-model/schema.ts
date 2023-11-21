import { z } from 'zod';

const payload = {
  body: z.object({
    brandSlug: z.string().min(1),
    name: z.string().min(1),
    upcoming: z.boolean(),

    brand: z.string().optional(),
  }),
};

const params = {
  params: z.object({
    brandModelSlug: z.string().min(1, 'No car model slug was found'),
  }),
};

const query = {
  query: z.object({
    get: z.string().optional(),
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
