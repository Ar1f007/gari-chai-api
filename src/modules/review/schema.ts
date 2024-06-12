import { z } from 'zod';

const payload = {
  body: z.object({
    reviewType: z.string().min(1, 'Review type is required'),
    title: z.string().min(1, 'title is required long').max(60, 'Too long (max 60 characters allowed)'),
    review: z.string().min(1, 'review content is required'),
    rating: z
      .number()
      .min(1, 'Required')
      .refine((val) => val >= 1 && val <= 5, { message: 'Rating should be between 1 to 5' }),
    userId: z.string().min(1, 'Required'),
    carId: z.string().min(1, 'Required'),
    status: z.enum(['pending', 'approved', 'discard']).default('pending').optional(),
    discardReason: z.string().optional(),
    metaData: z.record(z.string().min(1), z.unknown()).optional().default({}),
  }),
};

const params = {
  params: z.object({
    id: z.string({
      required_error: 'car id is required',
    }),
  }),
};

const query = {
  query: z
    .object({
      page: z.string().refine((val) => !isNaN(Number(val)), { message: 'Page value should be of type number' }),
      limit: z.string().refine((val) => !isNaN(Number(val)), { message: 'Page limit should be of type number' }),
      status: z.string().refine(
        (status) => {
          const pattern = /^(pending|approved|discard)(\.(pending|approved|discard))*$/;
          return pattern.test(status);
        },
        {
          message: 'Invalid status parameter',
        },
      ),
    })
    .partial(),
};

export const createReviewSchema = z.object({
  ...payload,
});

export const getReviewsByCarIdSchema = z.object({
  ...params,
});

export const getReviewsQuerySchema = z.object({
  ...query,
});

export const extPayload = payload.body.extend({
  isFeatured: z.boolean().optional().default(false),
  helpfulCount: z.number().optional().default(0),
  unhelpfulCount: z.number().optional().default(0),
  tags: z.array(z.string()).optional().default([]),
});

export const updateReviewSchema = z.object({
  params: z.object({
    id: z.string({
      required_error: 'car id is required',
    }),
  }),
  body: extPayload,
});

export type CreateNewReviewInputs = z.infer<typeof createReviewSchema>['body'];
export type ReadReviewsByCarInput = z.infer<typeof getReviewsByCarIdSchema>['params'];
export type GetReviewQueryInputs = z.infer<typeof getReviewsQuerySchema>;
export type UpdateReviewInputs = z.infer<typeof updateReviewSchema>;
