import { z } from 'zod';

const payload = {
  body: z.object({
    title: z.string().min(10, 'title should be min 10 characters long'),
    review: z.string().min(50, 'Review should be minimum 50 characters long'),
    rating: z
      .number()
      .min(1, 'Required')
      .refine((val) => val >= 1 && val <= 5, { message: 'Rating should be between 1 to 5' }),
    userId: z.string().min(1, 'Required'),
    carId: z.string().min(1, 'Required'),
    metaData: z.record(z.string().min(1), z.unknown()).optional().default({}),
  }),
};

const params = {
  params: z.object({
    carId: z.string({
      required_error: 'car id is required',
    }),
  }),
};

export const createReviewSchema = z.object({
  ...payload,
});

export const getReviewsByCarIdSchema = z.object({
  ...params,
});

export type CreateNewReviewInputs = z.infer<typeof createReviewSchema>['body'];
export type ReadReviewsByCarInput = z.infer<typeof getReviewsByCarIdSchema>['params'];
