import { Request, Response } from 'express';
import slugify from 'slugify';
import { CreateCarPartInputs, DeleteCarPartInput, GetCarPartsQueryInput, ReadCarPartInput } from './schema';
import { countCarParts, createNewCarPart, deleteCarPart, findCarPart, findCarParts } from './service';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';
import { CAR_PARTS_NAME_KEY, SORT_FIELD_SEPARATOR } from '../../constants';
import { deleteSettingItem } from '../home-settings';

function buildSearchFilters(query: GetCarPartsQueryInput['query']): Record<string, any> {
  const filters: Record<string, any> = {};

  if (query.name) {
    filters[CAR_PARTS_NAME_KEY] = { $regex: new RegExp(query.name, 'i') };
  }

  return filters;
}

function formatSortField(str: string): string {
  const [column, order] = str.split(SORT_FIELD_SEPARATOR);

  return order === 'asc' ? column : `-${column}`;
}

function getSortFields(sortQuery: GetCarPartsQueryInput['query']['sort']): string {
  let defaultSortStr = '-createdAt'; // by default latest "created at" first

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

// ==================================================================================================

export async function createCarPartHandler(req: Request<{}, {}, CreateCarPartInputs>, res: Response) {
  const slugifiedValue = slugify(req.body.name, { lower: true });

  const carPartWithSameSlugExist = await findCarPart({ slug: slugifiedValue });

  if (carPartWithSameSlugExist) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'A car part with the same name already exists!',
    });
  }

  const carPart = await createNewCarPart(req.body);

  if (!carPart) {
    throw new AppError('Could not create car part', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: carPart,
    message: 'Car part created successfully',
  });
}

export async function getCarPartsHandler(req: Request<{}, {}, {}, GetCarPartsQueryInput['query']>, res: Response) {
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

  // Retrieve total car parts count and paginated car parts data
  const [totalCarParts, foundCarParts] = await Promise.all([
    countCarParts(queryFilters),
    findCarParts(queryFilters, { skip: (currentPage - 1) * itemsPerPage, limit: itemsPerPage }, sortFields),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalCarParts / itemsPerPage);

  // Determine if there is a next page
  const hasNextPage = currentPage < totalPages;
  const nextPage = hasNextPage ? currentPage + 1 : null;

  // Send the response
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      results: foundCarParts,
      pagination: {
        totalItems: totalCarParts,
        totalPages,
        currentPage,
        nextPage,
        hasNextPage,
      },
    },
  });
}

export async function getCarPartHandler(req: Request<ReadCarPartInput['params']>, res: Response) {
  const slug = req.params.slug;

  const carPart = await findCarPart({ slug });

  if (!carPart) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'Car part was not found',
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: carPart,
  });
}

export async function deleteCarPartHandler(req: Request<DeleteCarPartInput['params']>, res: Response) {
  const _id = req.params.id;

  const carPart = await findCarPart({ _id });

  if (!carPart) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No car part was found',
    });
  }

  const deletedPart = await deleteCarPart({ _id });

  if (deletedPart.acknowledged) {
    deleteSettingItem({ contentId: carPart._id });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Car Part was deleted',
  });
}
