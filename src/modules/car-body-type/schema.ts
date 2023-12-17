import { z } from 'zod';
import { imageSchema } from '../../utils/helperSchema';

export const carBodyTypeCreateSchema = z.object({
  body: z.object({
    name: z.string(),
    image: imageSchema.optional(),
  }),
});

export type CarBodyTypeCreateInputs = z.infer<typeof carBodyTypeCreateSchema>['body'];
