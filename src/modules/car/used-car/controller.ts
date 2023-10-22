import { Request } from 'express';
import { createUsedCar } from './service';
import { CreateUsedCarInputs } from './schema';

export async function createUsedCarHandler(req: Request<{}, {}, CreateUsedCarInputs>, res: Response) {
  const car = await createUsedCar(req.body);
}
