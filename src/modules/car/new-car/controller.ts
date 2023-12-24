import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import dayjs from '../../../lib/dayjs';
import { countCars, createNewCar, deleteCar, findAndUpdateCar, findCar, findCars } from './service';
import { CreateNewCarInputs, DeleteCarInput, ReadCarInput, UpdateCarInput } from './schema';
import AppError from '../../../utils/appError';
import { updateBrandCarCollectionCount } from '../../brand/service';
import { updateBrandModelCarCollectionCount } from '../../brand-model/service';

//************************************************************************ */
// Helpers
//************************************************************************ */
function getQueryFilters(query: ReadCarInput['query']): Record<string, any> {
  const filters: Record<string, any> = {};

  if (query.tags) {
    let tagValues: string[] = [];

    if (query.tags.includes(',')) {
      tagValues = query.tags.split(',');
    } else {
      tagValues = [query.tags];
    }

    filters['tags.value'] = { $in: tagValues };
  }

  if (query.brand) {
    filters['brand.id'] = query.brand;
  }

  // determine which cars to show
  // is it "past" or cars which is not launched yet
  const launchStatus = query.launchStatus || 'past';

  const launchedDate = dayjs(query.launchedDate).toDate() || new Date();

  if (launchStatus === 'past') {
    filters['launchedAt'] = { $lte: launchedDate };
  } else {
    filters['launchedAt'] = { $gte: launchedDate };
  }

  return filters;
}

//************************************************************************ */
// Controller Functions
//************************************************************************ */

export async function createCarHandler(req: Request<{}, {}, CreateNewCarInputs>, res: Response) {
  const car = await createNewCar(req.body);

  if (!car) {
    throw new AppError('Could not create car', StatusCodes.BAD_REQUEST);
  }

  // increase the car collection count in brand and model
  updateBrandCarCollectionCount({ type: 'inc', brandId: req.body.brand.id });
  updateBrandModelCarCollectionCount({ type: 'inc', brandModelId: req.body.brandModel.id });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: car,
  });
}

export async function getCarsHandler(req: Request<{}, {}, {}, ReadCarInput['query']>, res: Response) {
  const queryFilters = getQueryFilters(req.query);

  const currentPage = Number(req.query.page) || 1;
  const itemsPerPage = Number(req.query.pageSize) || 10;

  const [totalCarCount, foundCars] = await Promise.all([
    countCars(queryFilters),
    findCars(queryFilters, { skip: (currentPage - 1) * itemsPerPage, limit: itemsPerPage }),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCarCount / itemsPerPage);

  // Determine if there is a next page
  const hasNextPage = currentPage < totalPages;
  const nextPage = hasNextPage ? currentPage + 1 : null;

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      results: foundCars,
      pagination: {
        totalItems: totalCarCount,
        totalPages: totalPages,
        currentPage: currentPage,
        nextPage: nextPage,
        hasNextPage: hasNextPage,
      },
    },
  });
}

export async function getCarHandler(req: Request<ReadCarInput['params']>, res: Response) {
  const carSlug = req.params.carSlug;

  const car = await findCar(
    { slug: carSlug },
    {
      populate: [
        {
          path: 'brand.id',
        },
        {
          path: 'brandModel.id',
        },
        {
          path: 'bodyStyle',
        },
      ],
    },
  );

  if (!car) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'Car was not found',
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: car,
  });
}

export async function updateCarHandler(
  req: Request<UpdateCarInput['params'], {}, UpdateCarInput['body']>,
  res: Response,
) {
  const carSlug = req.params.carSlug;
  const update = req.body;

  const car = await findCar({ slug: carSlug });

  if (!car) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No car found',
    });
  }

  const updatedCar = await findAndUpdateCar({ slug: carSlug }, update, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedCar,
  });
}

export async function deleteCarHandler(req: Request<DeleteCarInput['params']>, res: Response) {
  const carSlug = req.params.carSlug;

  const car = await findCar({ slug: carSlug });

  if (!car) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No car found',
    });
  }

  const deletedCar = await deleteCar({ slug: carSlug });

  if (deletedCar.acknowledged) {
    // decrease the car collection count in brand and model
    updateBrandCarCollectionCount({ type: 'dec', brandId: car.brand.id });
    updateBrandModelCarCollectionCount({ type: 'dec', brandModelId: req.body.brandModel.id });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Car was deleted',
  });
}

// export async function flushCacheHandler(_: Request, res: Response) {
//   cache.flushAll();

//   res.status(StatusCodes.OK).json({
//     status: 'success',
//     message: 'Cache is cleared',
//   });
// }
