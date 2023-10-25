import { z } from 'zod';
import { imageSchema } from '../../utils/helperSchema';

const payload = {
  body: z.object({
    name: z.string(),
    image: imageSchema.optional(),
  }),
};

const params = {
  params: z.object({
    brandSlug: z.string().min(1, 'No brand slug was found'),
  }),
};

export const createBrandSchema = z.object({
  ...payload,
});

export const updateBrandSchema = z.object({
  ...params,
  ...payload,
});

export const deleteBrandSchema = z.object({
  ...params,
});

export const getBrandSchema = z.object({
  ...params,
});

export type CreateNewBrandInputs = z.infer<typeof createBrandSchema>['body'];
export type ReadBrandInput = z.infer<typeof getBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type DeleteBrandInput = z.infer<typeof deleteBrandSchema>;
