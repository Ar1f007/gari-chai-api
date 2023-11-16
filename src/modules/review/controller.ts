import { Request, Response } from 'express';
import {
  createNewReview,
  //  deleteReview, findAndUpdateReview, findReview,
  findReviews,
  findReviewsWithStats,
} from './service';
import {
  CreateNewReviewInputs,
  ReadReviewsByCarInput,
  // DeleteReviewInput, ReadReviewInput, UpdateReviewInput
} from './schema';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';

export async function createReviewHandler(req: Request<{}, {}, CreateNewReviewInputs>, res: Response) {
  const review = await createNewReview(req.body);

  if (!review) {
    throw new AppError('Could not add the review', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: review,
    message: 'Review is added successfully',
  });
}

export async function getReviewsHandler(req: Request<ReadReviewsByCarInput>, res: Response) {
  const reviews = await findReviews({ carId: req.params.carId });

  await findReviewsWithStats(req.params.carId);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: reviews,
  });
}
