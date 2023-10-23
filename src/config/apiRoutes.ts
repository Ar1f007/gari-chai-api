import 'express-async-errors';

import { Express, Request, Response } from 'express';
import { carRouter } from '../modules/car/new-car';

function routes(app: Express) {
  app.get('/health-check', (_: Request, res: Response) => {
    res.status(200).json({ message: 'App is up and running' });
  });

  app.use('/api/v1/cars', carRouter);
}

export default routes;
