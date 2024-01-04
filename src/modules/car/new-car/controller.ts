import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import dayjs from '../../../lib/dayjs';
import { countCars, createNewCar, deleteCar, findAndUpdateCar, findCar, findCars } from './service';
import {
  CreateNewCarInputs,
  DeleteCarById,
  DeleteCarInput,
  GetCarQueryInput,
  ReadCarInput,
  UpdateCarInput,
  updateCarSchema,
} from './schema';
import AppError from '../../../utils/appError';
import { updateBrandCarCollectionCount } from '../../brand/service';
import { updateBrandModelCarCollectionCount } from '../../brand-model/service';
import { deleteSettingItem } from '../../home-settings';
import slugify from 'slugify';
import { updateVendorCarCollectionCount } from '../../vendors/service';

//************************************************************************ */
// Helpers
//************************************************************************ */
function getQueryFilters(query: GetCarQueryInput['query']): Record<string, any> {
  const filters: Record<string, any> = {};

  if (query.name) {
    filters['name'] = { $regex: new RegExp(query.name, 'i') };
  }

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

function formatSortOption(str: string): string {
  const [column, order] = str.split(':');

  return order === 'asc' ? column : `-${column}`;
}

function getSortFields(sortQuery: GetCarQueryInput['query']['sort']): string {
  let defaultSortStr = '-launchedAt'; // by default latest "launched at" first

  if (!sortQuery) return defaultSortStr;

  if (typeof sortQuery === 'string') {
    const formattedStr = formatSortOption(sortQuery);

    return formattedStr;
  }

  if (Array.isArray(sortQuery)) {
    const options: string[] = [];

    for (let i = 0; i < sortQuery.length; i++) {
      const formattedStr = formatSortOption(sortQuery[i]);

      options.push(formattedStr);
    }

    return options.join(' ');
  }

  return defaultSortStr;
}
//************************************************************************ */
// Controller Functions
//************************************************************************ */

export async function createCarHandler(req: Request<{}, {}, CreateNewCarInputs>, res: Response) {
  // check if 'all' is included in  `cities` property
  // if not then add it, so that we can show all cars
  const isAllIncluded = req.body.cities.find((city) => city.value === 'all');

  let clonedCopy = {} as CreateNewCarInputs;

  if (!isAllIncluded) {
    clonedCopy = structuredClone(req.body);
  }

  clonedCopy.cities = [
    {
      value: 'all',
      label: 'All',
    },
    ...req.body.cities,
  ];

  const car = await createNewCar(isAllIncluded ? req.body : clonedCopy);

  if (!car) {
    throw new AppError('Could not create car', StatusCodes.BAD_REQUEST);
  }

  // increase the car collection count in brand and model & vendor
  updateBrandCarCollectionCount({ type: 'inc', brandId: req.body.brand.value });
  updateBrandModelCarCollectionCount({ type: 'inc', brandModelId: req.body.brandModel.value });
  updateVendorCarCollectionCount({ type: 'inc', vendorId: req.body.vendor.value });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: car,
  });
}

export async function getCarsHandler(req: Request<{}, {}, {}, GetCarQueryInput['query']>, res: Response) {
  const DEFAULT_PAGE_NUMBER = 1;
  const MAX_ITEMS_LIMIT = 1000;
  const MAX_SAFE_LIMIT = 500;
  const DEFAULT_LIMIT = 10;

  const queryFilters = getQueryFilters(req.query);

  const currentPage = (req.query.page && !isNaN(+req.query.page) && +req.query.page) || DEFAULT_PAGE_NUMBER;

  const itemsPerPage =
    req.query.limit && !isNaN(+req.query.limit)
      ? +req.query.limit > MAX_ITEMS_LIMIT
        ? MAX_SAFE_LIMIT // to ensure memory does not go out of space
        : +req.query.limit
      : DEFAULT_LIMIT;

  const sortFields = getSortFields(req.query.sort);

  const [totalCarCount, foundCars] = await Promise.all([
    countCars(queryFilters),
    findCars(queryFilters, { skip: (currentPage - 1) * itemsPerPage, limit: itemsPerPage }, sortFields),
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
          path: 'brand.value',
        },
        {
          path: 'brandModel.value',
        },
        {
          path: 'bodyStyle.value',
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

  const parsedBody = updateCarSchema.shape.body.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'Invalid Inputs',
    });
  }

  const car = await findCar({ slug: carSlug });

  if (!car) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No car found',
    });
  }

  const clonedCopy = structuredClone(parsedBody.data);

  clonedCopy.slug = slugify(req.body.slug, {
    lower: true,
    trim: true,
  });

  const updatedCar = await findAndUpdateCar({ slug: carSlug }, clonedCopy, {
    new: true,
  });

  if (updatedCar) {
    if (car.brand.value !== req.body.brand.value) {
      // decrease the car collection count in the prev brand
      updateBrandCarCollectionCount({ type: 'dec', brandId: car.brand.value });

      // increase the car collection count in the new brand collection
      updateBrandCarCollectionCount({ type: 'inc', brandId: updatedCar.brand.value });
    }

    if (car.brandModel.value !== req.body.brandModel.value) {
      // decrease the car collection count in the prev model
      updateBrandModelCarCollectionCount({ type: 'dec', brandModelId: car.brand.value });

      // increase the car collection count in the new brand model collection
      updateBrandModelCarCollectionCount({ type: 'inc', brandModelId: updatedCar.brand.value });
    }

    if (car.vendor.value !== req.body.vendor.value) {
      // decrease the car collection count in the prev model
      updateVendorCarCollectionCount({ type: 'dec', vendorId: car.brand.value });

      // increase the car collection count in the new vendor model collection
      updateVendorCarCollectionCount({ type: 'inc', vendorId: updatedCar.brand.value });
    }
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedCar,
  });
}

export async function deleteCarByIdHandler(req: Request<{}, {}, DeleteCarById['body']>, res: Response) {
  const car = await findCar({ _id: req.body._id });

  if (!car) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: req.body.name + ' was not found',
    });
  }

  const deletedCar = await deleteCar({ _id: car._id });

  if (!deletedCar.acknowledged) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Could not delete ' + car.name,
    });
  }

  // decrease the car collection count in brand and model
  updateBrandCarCollectionCount({ type: 'dec', brandId: car.brand.value });
  updateBrandModelCarCollectionCount({ type: 'dec', brandModelId: car.brandModel.value });

  deleteSettingItem({ contentId: car._id });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Car was deleted',
  });
}

export async function deleteCarHandler(req: Request<DeleteCarInput['params']>, res: Response) {
  const carSlug = req.params.carSlug;

  const car = await findCar({ slug: carSlug });

  if (!car) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No car was found',
    });
  }

  const deletedCar = await deleteCar({ slug: carSlug });

  if (deletedCar.acknowledged) {
    // decrease the car collection count in brand and model
    updateBrandCarCollectionCount({ type: 'dec', brandId: car.brand.value });
    updateBrandModelCarCollectionCount({ type: 'dec', brandModelId: car.brandModel.value });
    updateVendorCarCollectionCount({ type: 'dec', vendorId: car.vendor.value });
    deleteSettingItem({ contentId: car._id });
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
