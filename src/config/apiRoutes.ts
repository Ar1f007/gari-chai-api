import 'express-async-errors';

import { Express, Request, Response } from 'express';
import { carRouter } from '../modules/car/new-car';
import { usedCarRouter } from '../modules/car/used-car';
import { brandRouter } from '../modules/brand/route';

function routes(app: Express) {
  app.get('/health-check', (_: Request, res: Response) => {
    res.status(200).json({ message: 'App is up and running' });
  });

  app.use('/api/v1/cars', carRouter);
  app.use('/api/v1/used-cars', usedCarRouter);
  app.use('/api/v1/brands', brandRouter);
}

export default routes;
