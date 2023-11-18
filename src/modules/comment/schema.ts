import { z } from 'zod';
import { validMongoIdSchema } from '../../lib/zod/commonSchemas';

// when validating comment payload that is received from request object
const payload = {
  body: z.object({
    userId: validMongoIdSchema,
    carId: validMongoIdSchema,
    isParent: z.boolean(),
    content: z.string().min(1, 'Comment is required'),
    parentId: validMongoIdSchema.optional(),
  }),
};

// this is used when creating a comment
export const createCommentBodySchema = z.object({
  car: validMongoIdSchema,
  user: validMongoIdSchema,
  parentId: z.optional(validMongoIdSchema),
  content: z.string().min(1, 'Comment is required'),
});

const params = {
  params: z.object({
    carId: validMongoIdSchema,
  }),
};

export const createCommentSchema = z.object({
  ...payload,
});

export const getCommentsSchema = z.object({
  ...params,
});

export type CreateCommentInputs = z.infer<typeof createCommentSchema>['body'];

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;

export type GetCommentsInputs = z.infer<typeof getCommentsSchema>;
