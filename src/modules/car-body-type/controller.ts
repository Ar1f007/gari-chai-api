import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';

import { CarBodyTypeCreateInputs } from './schema';
import { createBodyType, findBodyType, findAllBodyTypes, deleteBodyType } from './service';
import { findCar } from '../car/new-car';
import AppError from '../../utils/appError';

export async function createCarBodyTypeHandler(req: Request<{}, {}, CarBodyTypeCreateInputs>, res: Response) {
  const slugifiedValue = slugify(req.body.name, { lower: true });

  const alreadyExists = await findBodyType({ slug: slugifiedValue });

  if (alreadyExists) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Same vehicle type already exists',
    });
  }

  const doc = await createBodyType(req.body);

  if (!doc) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Could not add body type',
    });
  }

  return res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: doc,
  });
}

export async function getAllBodyTypesHandler(req: Request, res: Response) {
  const bodyTypes = await findAllBodyTypes();

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: bodyTypes,
  });
}

export async function deleteBodyTypeHandler(req: Request, res: Response) {
  const { id } = req.body;

  if (!id) {
    throw new AppError('ID is required', StatusCodes.BAD_REQUEST);
  }

  const carExist = await findCar({ 'bodyStyle.id': id });

  if (carExist) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Can not delete this body type, it is associated with a car',
    });
  }

  await deleteBodyType(id);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: null,
  });
}
