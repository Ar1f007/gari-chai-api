import express from 'express';
import { authenticated, validateResource } from '../../middleware';
import { createReviewSchema, getReviewsByCarIdSchema, updateReviewSchema } from './schema';
import {
  createReviewHandler,
  deleteUserReviewsHandler,
  getAllCarReviewsHandler,
  getReviewsHandler,
  getUserReviewsHandler,
  updateReviewHandler,
} from './controller';

const reviewRouter = express.Router();

reviewRouter.route('/').post(validateResource(createReviewSchema), createReviewHandler);

reviewRouter.route('/cars').get(getAllCarReviewsHandler);

reviewRouter.route('/users/:id').get(authenticated, getUserReviewsHandler);

reviewRouter
  .route('/:id')
  .get(validateResource(getReviewsByCarIdSchema), getReviewsHandler)
  .delete(authenticated, deleteUserReviewsHandler);

reviewRouter.route('/update/:id').patch(validateResource(updateReviewSchema), updateReviewHandler);

export default reviewRouter;
