import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils/appError';
import { CreateUsedCarInputs, DeleteUsedCarInput, UpdateUsedCarInput } from './schema';
import { createUsedNewCar, deleteUsedCar, findAndUpdateUsedCar, findUsedCar, findUsedCars } from './service';

export async function createUsedCarHandler(req: Request<{}, {}, CreateUsedCarInputs>, res: Response) {
  const car = await createUsedNewCar(req.body);

  if (!car) {
    throw new AppError('Could not create car', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: car,
  });
}

export async function getUsedCarsHandler(req: Request, res: Response) {
  const cars = await findUsedCars();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: cars,
  });
}

export async function getUsedCarHandler(req: Request<UpdateUsedCarInput['params']>, res: Response) {
  const carSlug = req.params.carSlug;

  const car = await findUsedCar({ slug: carSlug });

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

export async function updateUsedCarHandler(
  req: Request<UpdateUsedCarInput['params'], {}, UpdateUsedCarInput['body']>,
  res: Response,
) {
  const carSlug = req.params.carSlug;
  const update = req.body;

  const car = await findUsedCar({ slug: carSlug });

  if (!car) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No car found',
    });
  }

  const updatedCar = await findAndUpdateUsedCar({ slug: carSlug }, update, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedCar,
  });
}

export async function deleteUsedCarHandler(req: Request<DeleteUsedCarInput['params']>, res: Response) {
  const carSlug = req.params.carSlug;

  const car = await findUsedCar({ slug: carSlug });

  if (!car) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No car found',
    });
  }

  await deleteUsedCar({ slug: carSlug });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Car was deleted',
  });
}
