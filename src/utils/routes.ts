import 'express-async-errors';

import { Express } from 'express';
import { carRouter } from '../modules/car/new-car';

function routes(app: Express) {
  app.use('/api/v1/cars', carRouter);
}

export default routes;
