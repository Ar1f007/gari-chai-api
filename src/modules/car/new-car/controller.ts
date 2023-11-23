import { Request, Response } from 'express';
import { createNewCar, deleteCar, findAndUpdateCar, findCar, findCars } from './service';
import { CreateNewCarInputs, DeleteCarInput, ReadCarInput, UpdateCarInput } from './schema';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/appError';
import { updateBrandCarCollectionCount } from '../../brand/service';

export async function createCarHandler(req: Request<{}, {}, CreateNewCarInputs>, res: Response) {
  const car = await createNewCar(req.body);

  if (!car) {
    throw new AppError('Could not create car', StatusCodes.BAD_REQUEST);
  }

  // increase the car collection count in brand model
  await updateBrandCarCollectionCount({ type: 'inc', brandId: req.body.brand });

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: car,
  });
}

export async function getCarsHandler(req: Request<{}, {}, {}, ReadCarInput['query']>, res: Response) {
  const queries: Record<string, string> = {};

  if (req.query.brand) {
    queries['brand'] = req.query.brand;
  }

  const cars = await findCars(queries);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: cars,
  });
}

export async function getCarHandler(req: Request<ReadCarInput['params']>, res: Response) {
  const carSlug = req.params.carSlug;

  const car = await findCar(
    { slug: carSlug },
    {
      populate: [
        {
          path: 'brand',
        },
        {
          path: 'brandModel',
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
    // decrease the car collection count in brand model
    await updateBrandCarCollectionCount({ type: 'dec', brandId: car.brand });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Car was deleted',
  });
}
