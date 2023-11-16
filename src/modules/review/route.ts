import express from 'express';
import { validateResource } from '../../middleware';
import { createReviewSchema, getReviewsByCarIdSchema } from './schema';
import { createReviewHandler, getReviewsHandler } from './controller';

const reviewRouter = express.Router();

reviewRouter.route('/').post(validateResource(createReviewSchema), createReviewHandler);

reviewRouter.route('/:carId').get(validateResource(getReviewsByCarIdSchema), getReviewsHandler);

export default reviewRouter;
