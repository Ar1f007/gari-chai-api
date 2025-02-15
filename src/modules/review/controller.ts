import { Request, Response } from 'express';
import {
  countReviews,
  createNewReview,
  deleteReview,
  findAndUpdateReview,
  findReviews,
  findReviewsWithStats,
} from './service';
import {
  CreateNewReviewInputs,
  GetReviewQueryInputs,
  ReadReviewsByCarInput,
  UpdateReviewInputs,
  updateReviewSchema,
} from './schema';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';

//*********************************************************

//*********************************************************

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
  const reviewsStats = await findReviewsWithStats(req.params.id);
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      ...reviewsStats,
    },
  });
}

export async function getAllCarReviewsHandler(req: Request<{}, {}, {}, GetReviewQueryInputs['query']>, res: Response) {
  // Default values for pagination
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_ITEMS_PER_PAGE = 10;

  // Maximum allowed values for pagination
  const MAX_ALLOWED_ITEMS = 1000; // Maximum documents allowed to be returned
  const MAX_SAFE_ITEMS_LIMIT = 500; // Maximum items to return if requested exceeds the limit

  // Parse and validate the current page number
  const currentPage = (req.query.page && !isNaN(Number(req.query.page)) && +req.query.page) || DEFAULT_PAGE_NUMBER;

  // Parse and validate items per page, considering maximum allowed items
  const requestedItemsPerPage =
    req.query.limit && !isNaN(Number(req.query.limit)) ? +req.query.limit : DEFAULT_ITEMS_PER_PAGE;
  const itemsPerPage = Math.min(requestedItemsPerPage, MAX_ALLOWED_ITEMS, MAX_SAFE_ITEMS_LIMIT);

  const queryFilters: Record<string, any> = {};

  if (req.query.status) {
    if (!req.query.status.includes('.')) {
      queryFilters['status'] = req.query.status;
    } else {
      const statusValues = req.query.status.split('.');
      queryFilters['$or'] = statusValues.map((status) => ({ status }));
    }
  }

  // Extract and validate sort fields
  // const sortFields = getSortFields(req.query.sort);

  // Retrieve total car count and paginated car data
  const [totalReviewsCount, foundReviews] = await Promise.all([
    countReviews(queryFilters),
    findReviews(queryFilters, { skip: (currentPage - 1) * itemsPerPage, limit: itemsPerPage, sort: '-createdAt' }),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalReviewsCount / itemsPerPage);

  // Determine if there is a next page
  const hasNextPage = currentPage < totalPages;
  const nextPage = hasNextPage ? currentPage + 1 : null;

  // Send the response
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      results: foundReviews,
      pagination: {
        totalItems: totalReviewsCount,
        totalPages,
        currentPage,
        nextPage,
        hasNextPage,
      },
    },
  });
}

export async function updateReviewHandler(
  req: Request<UpdateReviewInputs['params'], {}, UpdateReviewInputs['body']>,
  res: Response,
) {
  const parsedBody = updateReviewSchema.shape.body.parse(req.body);

  const review = await findAndUpdateReview(
    {
      _id: req.params.id,
    },
    parsedBody,
    {
      new: true,
    },
  );

  if (!review) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'The review you are trying to update no longer exist',
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: review,
    message: 'Review updated successfully',
  });
}

export async function getUserReviewsHandler(req: Request<ReadReviewsByCarInput>, res: Response) {
  const userId = req.params.id;

  const userReviews = await findReviews({ userId }, { populate: 'userId' });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'successfully',
    data: userReviews,
  });
}

export async function deleteUserReviewsHandler(req: Request<ReadReviewsByCarInput>, res: Response) {
  const reviewId = req.params.id;

  await deleteReview({ _id: reviewId });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Review deleted successfully',
    data: null,
  });
}
