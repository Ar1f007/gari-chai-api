import { z } from 'zod';
import { validMongoIdSchema } from '../../lib/zod/commonSchemas';

// when validating comment payload that is received from request object
const payload = {
  body: z.object({
    user: validMongoIdSchema,
    car: validMongoIdSchema,
    isChild: z.boolean(),
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
  depth: z.number().optional(),
});

const params = {
  params: z.object({
    id: validMongoIdSchema,
  }),
};

export const createCommentSchema = z.object({
  ...payload,
});

export const getCommentsSchema = z.object({
  ...params,
});

export const updateCommentSchema = z.object({
  ...params,

  body: z.object({
    commentBody: z.object({
      content: z.string(),
    }),
  }),
});

export type CreateCommentInputs = z.infer<typeof createCommentSchema>['body'];

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;

export type GetCommentsInputs = z.infer<typeof getCommentsSchema>;

export type UpdateCommentInputs = z.infer<typeof updateCommentSchema>;
