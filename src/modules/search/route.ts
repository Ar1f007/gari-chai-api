import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Car from '../car/new-car/model';
import { getCarsHandler, getCarQuerySchema, GetCarQueryInput } from '../car/new-car';
import { validateResource } from '../../middleware';

const searchRouter = express.Router();

searchRouter.get('/new', validateResource(getCarQuerySchema), getCarsHandler);

searchRouter.get(
  '/',
  validateResource(getCarQuerySchema),
  async (req: Request<{}, {}, {}, GetCarQueryInput['query']>, res: Response) => {
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
        'price.min': { $gte: +min },
        'price.max': { $lte: +max },
      });
    }

    if (req.query.query) {
      conditions.push({ name: { $regex: new RegExp(req.query.query, 'i') } });
    }

    if (req.query.seats) {
      const seatValues = req.query.seats.split(',').filter(Boolean).map(Number);
      conditions.push({ seatingCapacity: { $in: seatValues } });
    }

    if (req.query.fuelType) {
      const fuelTypeValues = req.query.fuelType.split(',').filter(Boolean);
      conditions.push({
        fuel: {
          $elemMatch: {
            'value.fuelType': { $in: fuelTypeValues },
          },
        },
      });
    }

    // Pagination
    const page = req.query.page ? parseInt(req.query.page) || 1 : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) || 10 : 10;
    const skip = (page - 1) * limit;

    // separate the search query based on car type
    // if car type is `new` then search in Car collection
    // if the type is `used` then search in the Used car collection

    if (req.query.car && req.query.car === 'new' && req.query.scope !== 'global') {
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

    if (req.query.car && req.query.car === 'used' && req.query.scope !== 'global') {
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
  },
);

export default searchRouter;
