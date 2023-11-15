import { z } from 'zod';

const payload = {
  body: z.object({
    title: z.string().min(1, 'Required'),
    review: z.string().min(1, 'Required'),
    rating: z.number().min(1, 'Required'),
    userId: z.string().min(1, 'Required'),
    carId: z.string().min(1, 'Required'),
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
