import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Car from '../car/new-car/model';

type ReadSearchQuery = {
  car: 'new' | 'used';
  q: string;
  brand: string;
  model: string;
  name: string;
  budget: string;
  bodyType: string;
};

const searchRouter = express.Router();

searchRouter.get('/', async (req: Request<{}, {}, {}, ReadSearchQuery>, res: Response) => {
  let query: any = {};

  // let page = parseInt(req.query.page as string) || 1;
  // let pageSize = parseInt(req.query.pageSize as string) || 20;

  // Handle specific brand, model and body-style queries
  if (req.query.brand) {
    query['brand.name'] = { $regex: new RegExp(req.query.brand, 'i') };
  }

  if (req.query.model) {
    query['model.name'] = { $regex: new RegExp(req.query.model, 'i') };
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
  // if car type is `new` then search in Car model
  // if the type is `used` then search in the Used car collection
  if (req.query.car && req.query.car === 'new') {
    const results = await Car.find({
      $or: [query],
    });

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: results,
      message: '',
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: [],
    message: '',
  });
});

export default searchRouter;
