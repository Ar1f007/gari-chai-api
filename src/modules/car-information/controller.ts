import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';

import { VehicleTypeCreateInputs } from './schema';
import { createVehicleType, findFromCarInformation } from './service';

export async function createVehicleBodyHandler(req: Request<{}, {}, VehicleTypeCreateInputs>, res: Response) {
  const slugifiedValue = slugify(req.body.name, { lower: true });

  const alreadyExists = await findFromCarInformation({ slug: slugifiedValue });

  if (alreadyExists) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Same vehicle type already exists',
    });
  }

  const doc = await createVehicleType(req.body);

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
