import { Request, Response } from 'express';
import { createUsedCar } from './service';
import { CreateUsedCarInputs } from './schema';
import { StatusCodes } from 'http-status-codes';

export async function createUsedCarHandler(req: Request<{}, {}, CreateUsedCarInputs>, res: Response) {
  const car = await createUsedCar(req.body);

  res.status(StatusCodes.CREATED).json(car);
}
