import { CarInputs } from './schema';
import { Request, Response } from 'express';
import { createCar } from './service';

export async function createCarHandler(req: Request<{}, {}, CarInputs>, res: Response) {
  const car = await createCar(req.body);
}
