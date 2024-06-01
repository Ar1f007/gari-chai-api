import { Request, Response } from 'express';
import slugify from 'slugify';
import { CreateCarPartInputs } from './schema';
import { createNewCarPart, findCarPart, findCarParts } from './service';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';

export async function createCarPartHandler(req: Request<{}, {}, CreateCarPartInputs>, res: Response) {
  const slugifiedValue = slugify(req.body.name, { lower: true });

  const carPartWithSameSlugExist = await findCarPart({ slug: slugifiedValue });

  if (carPartWithSameSlugExist) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'A car part with the same name already exists!',
    });
  }

  const carPart = await createNewCarPart(req.body);

  if (!carPart) {
    throw new AppError('Could not create car part', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: carPart,
    message: 'Car part created successfully',
  });
}

export async function getCarPartsHandler(req: Request<{}, {}, {}, {}>, res: Response) {
  const carParts = await findCarParts();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: carParts,
  });
}
