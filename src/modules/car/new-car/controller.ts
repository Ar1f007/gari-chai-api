import { Request, Response } from 'express';
import { createNewCar, findAndUpdateCar, findCar, findCars } from './service';
import { CreateNewCarInputs, UpdateCarInput } from './schema';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/appError';

export async function createCarHandler(req: Request<{}, {}, CreateNewCarInputs>, res: Response) {
  const car = await createNewCar(req.body);

  if (!car) {
    throw new AppError('Could not create car', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: car,
  });
}

export async function getCarsHandler(req: Request, res: Response) {
  const cars = await findCars();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: cars,
  });
}

export async function getCarHandler(req: Request<UpdateCarInput['params']>, res: Response) {
  const carSlug = req.params.carSlug;

  const car = await findCar({ slug: carSlug });

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
