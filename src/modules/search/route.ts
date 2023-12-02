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
  //   const {
  //     query = '',
  //     page = '1',
  //     limit = '20',
  //     car = '',
  //     budget = '',
  //     bodyType = '',
  //     brand = '',
  //     model = '',
  //     city = 'all',
  //     scope = 'global',
  //   } = searchParams || {};

  let query: any = {};

  // let page = parseInt(req.query.page as string) || 1;
  // let pageSize = parseInt(req.query.pageSize as string) || 20;

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

  // separate the search query based on car type
  // if car type is `new` then search in Car collection
  // if the type is `used` then search in the Used car collection
  if (req.query.car && req.query.car === 'new') {
    const results = await Car.find({
      $or: [query],
    }).lean();

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: results,
      message: '',
    });
  }

  if (req.query.car && req.query.car === 'used') {
    return res.send('TO BE REPLACED SOON');
  }

  if (req.query.query && req.query.scope === 'global') {
    const query = { $regex: new RegExp(req.query.query, 'i') };
    const results = await Car.find({
      $or: [
        {
          name: query,
        },
        {
          'brand.name': query,
        },
        {
          'brandModel.name': query,
        },
        {
          'bodyStyle.name': query,
        },
      ],
    }).lean();

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: {
        results,
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
