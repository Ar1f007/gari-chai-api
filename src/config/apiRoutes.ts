import 'express-async-errors';

import { Express, Request, Response } from 'express';
import { carRouter } from '../modules/car/new-car';
// import { usedCarRouter } from '../modules/car/used-car';
import { brandRouter } from '../modules/brand/route';
import { homeSettingRouter } from '../modules/home-settings';
import { brandModelRouter } from '../modules/brand-model/route';
import userRouter from '../modules/user/route';
import reviewRouter from '../modules/review/route';
import commentRouter from '../modules/comment/route';
import carBodyTypeRouter from '../modules/car-body-type/route';
import searchRouter from '../modules/search/route';
import sliderRouter from '../modules/slider/route';

function routes(app: Express) {
  app.get('/health-check', (_: Request, res: Response) => {
    res.status(200).json({ message: 'App is up and running' });
  });

  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/cars', carRouter);
  app.use('/api/v1/search', searchRouter);
  // app.use('/api/v1/used-cars', usedCarRouter);
  app.use('/api/v1/brands', brandRouter);
  app.use('/api/v1/models', brandModelRouter);
  app.use('/api/v1/car-body-types', carBodyTypeRouter);

  app.use('/api/v1/home-settings', homeSettingRouter);
  app.use('/api/v1/sliders', sliderRouter);
  app.use('/api/v1/reviews', reviewRouter);
  app.use('/api/v1/comments', commentRouter);
}

export default routes;
