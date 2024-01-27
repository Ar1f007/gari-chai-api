import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Car from '../car/new-car/model';
import { getCarsHandler, getCarQuerySchema } from '../car/new-car';
import { validateResource } from '../../middleware';

type QueryParams = {
  car: 'new' | 'used';
  budget: string;
  bodyType: string;
  brand: string;
  model: string;
  city: string;
  query: string;
  page: string;
  limit: string;
  scope: 'new-car' | 'used-car' | 'global';
};

const searchRouter = express.Router();

searchRouter.get('/new', validateResource(getCarQuerySchema), getCarsHandler);

searchRouter.get('/', async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  const conditions: Record<string, any>[] = [];

  if (req.query.brand) {
    conditions.push({ 'brand.label': { $regex: new RegExp(req.query.brand, 'i') } });
  }

  if (req.query.model) {
    conditions.push({ 'brandModel.label': { $regex: new RegExp(req.query.model, 'i') } });
  }

  if (req.query.bodyType) {
    conditions.push({ 'bodyStyle.label': { $regex: new RegExp(req.query.bodyType, 'i') } });
  }

  // Handle budget range
  if (req.query.budget) {
    const [min, max] = (req.query.budget as string).split('-');

    conditions.push({
      'price.min': { $gte: parseInt(min) },
      'price.max': { $lte: parseInt(max) },
    });
  }

  if (req.query.query) {
    conditions.push({ name: { $regex: new RegExp(req.query.query, 'i') } });
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // separate the search query based on car type
  // if car type is `new` then search in Car collection
  // if the type is `used` then search in the Used car collection

  if (req.query.car && req.query.car === 'new') {
    const [totalResults, results] = await Promise.all([
      Car.countDocuments({ $or: conditions }),
      Car.find({ $or: conditions }).skip(skip).limit(limit),
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : null;

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        results,
        pagination: {
          totalItems: totalResults,
          totalPages,
          currentPage: page,
          hasNextPage,
          nextPage,
        },
      },
    });
  }

  if (req.query.car && req.query.car === 'used') {
    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        results: [],
        pagination: {
          totalItems: 0,
          totalPages: 0,
          currentPage: page,
          hasNextPage: false,
          nextPage: null,
        },
      },
    });
  }

  // it is used when user types in something in the search input field
  if (req.query.query && req.query.scope === 'global') {
    const term = { $regex: new RegExp(req.query.query, 'i') };

    const query = [
      {
        name: term,
      },
      {
        'brand.label': term,
      },
      {
        'brandModel.label': term,
      },
      {
        'bodyStyle.label': term,
      },
    ];

    const [totalResults, results] = await Promise.all([
      Car.countDocuments({ $or: query }),
      Car.find({ $or: query }).skip(skip).limit(limit),
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : null;

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        results,
        pagination: {
          totalItems: totalResults,
          totalPages,
          currentPage: page,
          hasNextPage,
          nextPage,
        },
      },
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      results: [],
    },
    message: '',
  });
});

export default searchRouter;
