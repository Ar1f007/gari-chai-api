import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';

import { CarBodyTypeCreateParams, UpdateCarBodyTypeParams } from './schema';
import { createBodyType, findBodyType, findAllBodyTypes, deleteBodyType, findAndUpdateCarBodyType } from './service';
import { findAndUpdateManyCar, findCar } from '../car/new-car';
import AppError from '../../utils/appError';
import { CAR_MODEL_BODY_STYLE_LABEL_PATH, CAR_MODEL_BODY_STYLE_PATH } from '../../constants';

export async function createCarBodyTypeHandler(req: Request<{}, {}, CarBodyTypeCreateParams>, res: Response) {
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

export async function updateCarBodyTypeHandler(
  req: Request<UpdateCarBodyTypeParams['params'], {}, UpdateCarBodyTypeParams['body']>,
  res: Response,
) {
  const bodyTypeId = req.params.id;
  const update = req.body;

  const brand = await findBodyType({ _id: bodyTypeId });

  if (!brand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No body type found',
    });
  }

  const updatedBodyType = await findAndUpdateCarBodyType({ _id: bodyTypeId }, update, {
    new: true,
  });

  // update the brand name of in car documents
  if (updatedBodyType) {
    findAndUpdateManyCar(
      { [CAR_MODEL_BODY_STYLE_PATH]: updatedBodyType.id },
      { [CAR_MODEL_BODY_STYLE_LABEL_PATH]: updatedBodyType.name },
    );
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedBodyType,
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
