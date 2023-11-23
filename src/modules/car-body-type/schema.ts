import { z } from 'zod';

export const carBodyTypeCreateSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export type CarBodyTypeCreateInputs = z.infer<typeof carBodyTypeCreateSchema>['body'];
