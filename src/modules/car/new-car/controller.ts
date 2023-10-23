import { Request, Response } from 'express';
import { createNewCar } from './service';
import { CreateNewCarInputs } from './schema';
import { StatusCodes } from 'http-status-codes';

export async function createCarHandler(req: Request<{}, {}, CreateNewCarInputs>, res: Response) {
  const car = await createNewCar(req.body);

  res.status(StatusCodes.CREATED).json(car);
}
