import express from 'express';
import { validateResource } from '../../middleware';
import { createReviewSchema, getReviewsByCarIdSchema, updateReviewSchema } from './schema';
import { createReviewHandler, getAllCarReviewsHandler, getReviewsHandler, updateReviewHandler } from './controller';

const reviewRouter = express.Router();

reviewRouter.route('/').post(validateResource(createReviewSchema), createReviewHandler);

reviewRouter.route('/cars').get(getAllCarReviewsHandler);

reviewRouter.route('/:carId').get(validateResource(getReviewsByCarIdSchema), getReviewsHandler);

reviewRouter.route('/update/:id').patch(validateResource(updateReviewSchema), updateReviewHandler);

export default reviewRouter;
