import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';

import { CarBodyTypeCreateInputs } from './schema';
import { createBodyType, findBodyType, findAllBodyTypes } from './service';

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
