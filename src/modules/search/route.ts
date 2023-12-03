import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Car from '../car/new-car/model';

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

searchRouter.get('/', async (req: Request<{}, {}, {}, QueryParams>, res: Response) => {
  let query: any = {};

  // Handle specific brand, model and body-style queries
  if (req.query.brand) {
    query['brand.name'] = { $regex: new RegExp(req.query.brand, 'i') };
  }

  if (req.query.model) {
    query['brandModel.name'] = { $regex: new RegExp(req.query.model, 'i') };
  }

  if (req.query.bodyType) {
    query['bodyStyle.name'] = { $regex: new RegExp(req.query.bodyType, 'i') };
  }

  // Handle budget range
  if (req.query.budget) {
    const [min, max] = (req.query.budget as string).split('-');

    query['price.min'] = {
      $gte: parseInt(min),
    };
    query['price.max'] = {
      $lte: parseInt(max),
    };
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
      Car.countDocuments({ $or: [query] }),
      Car.find({ $or: [query] })
        .skip(skip)
        .limit(limit),
    ]);

    const totalPages = Math.ceil(totalResults / limit);

    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : null;

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        results,
        pagination: {
          totalResults,
          totalPages,
          currentPage: page,
          hasNextPage,
          nextPage,
        },
      },
    });
  }

  if (req.query.car && req.query.car === 'used') {
    return res.send('TO BE REPLACED SOON');
  }

  if (req.query.query && req.query.scope === 'global') {
    const term = { $regex: new RegExp(req.query.query, 'i') };

    const query = [
      {
        name: term,
      },
      {
        'brand.name': term,
      },
      {
        'brandModel.name': term,
      },
      {
        'bodyStyle.name': term,
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
