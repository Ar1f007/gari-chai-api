import { z } from 'zod';
import { imageSchema } from '../../utils/helperSchema';

const params = {
  params: z.object({
    id: z.string().min(1, 'Id is required'),
  }),
};

const payload = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    image: imageSchema.optional(),
  }),
};

export const carBodyTypeCreateSchema = z.object({
  ...payload,
});

export const updateBodyTypeSchema = z.object({
  ...params,
  ...payload,
});

export const deleteBodyTypeSchema = z.object({
  ...params,
});

// export const getBrandSchema = z.object({
//   ...params,
//   ...query,
// });

export type CarBodyTypeCreateParams = z.infer<typeof carBodyTypeCreateSchema>['body'];
// export type ReadBrandInput = z.infer<typeof getBrandSchema>;
export type UpdateCarBodyTypeParams = z.infer<typeof updateBodyTypeSchema>;
export type DeleteCarBodyTypeParams = z.infer<typeof deleteBodyTypeSchema>;
