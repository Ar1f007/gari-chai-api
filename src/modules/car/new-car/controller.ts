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
import { deleteSettingItem, updateHomeSettingContentData } from '../../home-settings';
import slugify from 'slugify';
import { updateVendorCarCollectionCount } from '../../vendors/service';
import {
  CAR_MODEL_BODY_STYLE_PATH,
  CAR_MODEL_BRAND_MODEL_PATH,
  CAR_MODEL_BRAND_PATH,
  CAR_MODEL_LAUNCHED_AT_KEY,
  CAR_MODEL_NAME_KEY,
  CAR_MODEL_TAGS_PATH,
  CAR_MODEL_VENDOR_PATH,
  SORT_FIELD_SEPARATOR,
} from '../../../constants';

//************************************************************************ */
// Helpers
//************************************************************************ */

/**
 * Extracts launch status information from the query parameter.
 *
 * @description
 * The function interprets the provided query parameter to determine the launch status.
 * Possible values include: 'past', 'future', 'past.future', 'future.past', or undefined.
 *
 * @param query - The query parameter representing launch status.
 * @returns
 * - If the query is undefined, returns the default value 'past'.
 * - If the query is a single value ('past' or 'future'), returns the same value.
 * - If the query is a combination ('past.future' or 'future.past'), returns an array of two values.
 */
function getLaunchStatus(query: GetCarQueryInput['query']['launchedAt']) {
  if (!query) return 'past';

  if (!query.includes('.')) return query;

  return query.split('.');
}
function buildSearchFilters(query: GetCarQueryInput['query']): Record<string, any> {
  const filters: Record<string, any> = {};

  if (query.name) {
    filters[CAR_MODEL_NAME_KEY] = { $regex: new RegExp(query.name, 'i') };
  }

  if (query.tags) {
    let tagValues: string[] = [];

    if (query.tags.includes(',')) {
      tagValues = query.tags.split(',');
    } else {
      tagValues = [query.tags];
    }

    filters[CAR_MODEL_TAGS_PATH] = { $in: tagValues };
  }

  if (query.brand) {
    filters[CAR_MODEL_BRAND_PATH] = query.brand;
  }

  // determine which cars to show
  // is it "past" or cars which is not launched yet
  const launchStatus = getLaunchStatus(query.launchedAt);

  const launchedDate = dayjs(query.launchedDate).toDate() || new Date();

  if (Array.isArray(launchStatus)) {
    // since it is an array, means we are wanting all cars irrespective of
    // future or past, so do nothing, it will give us all the docs
  } else if (launchStatus === 'past') {
    filters[CAR_MODEL_LAUNCHED_AT_KEY] = { $lte: launchedDate };
  } else {
    filters[CAR_MODEL_LAUNCHED_AT_KEY] = { $gte: launchedDate };
  }

  return filters;
}

function formatSortField(str: string): string {
  const [column, order] = str.split(SORT_FIELD_SEPARATOR);

  return order === 'asc' ? column : `-${column}`;
}

function getSortFields(sortQuery: GetCarQueryInput['query']['sort']): string {
  let defaultSortStr = '-launchedAt'; // by default latest "launched at" first

  if (!sortQuery) return defaultSortStr;

  if (typeof sortQuery === 'string') {
    const formattedStr = formatSortField(sortQuery);

    return formattedStr;
  }

  if (Array.isArray(sortQuery)) {
    const options: string[] = [];

    for (let i = 0; i < sortQuery.length; i++) {
      const formattedStr = formatSortField(sortQuery[i]);

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
  // Default values for pagination
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_ITEMS_PER_PAGE = 10;

  // Maximum allowed values for pagination
  const MAX_ALLOWED_ITEMS = 1000; // Maximum documents allowed to be returned
  const MAX_SAFE_ITEMS_LIMIT = 500; // Maximum items to return if requested exceeds the limit

  // Extract and process query filters
  const queryFilters = buildSearchFilters(req.query);
  // Parse and validate the current page number
  const currentPage = (req.query.page && !isNaN(Number(req.query.page)) && +req.query.page) || DEFAULT_PAGE_NUMBER;

  // Parse and validate items per page, considering maximum allowed items
  const requestedItemsPerPage =
    req.query.limit && !isNaN(Number(req.query.limit)) ? +req.query.limit : DEFAULT_ITEMS_PER_PAGE;
  const itemsPerPage = Math.min(requestedItemsPerPage, MAX_ALLOWED_ITEMS, MAX_SAFE_ITEMS_LIMIT);

  // Extract and validate sort fields
  const sortFields = getSortFields(req.query.sort);

  // Retrieve total car count and paginated car data
  const [totalCarCount, foundCars] = await Promise.all([
    countCars(queryFilters),
    findCars(queryFilters, { skip: (currentPage - 1) * itemsPerPage, limit: itemsPerPage }, sortFields),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCarCount / itemsPerPage);

  // Determine if there is a next page
  const hasNextPage = currentPage < totalPages;
  const nextPage = hasNextPage ? currentPage + 1 : null;

  // Send the response
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      results: foundCars,
      pagination: {
        totalItems: totalCarCount,
        totalPages,
        currentPage,
        nextPage,
        hasNextPage,
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
          path: CAR_MODEL_VENDOR_PATH,
        },
        {
          path: CAR_MODEL_BRAND_PATH,
        },
        {
          path: CAR_MODEL_BRAND_MODEL_PATH,
        },
        {
          path: CAR_MODEL_BODY_STYLE_PATH,
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

    updateHomeSettingContentData({ content: updatedCar });
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
