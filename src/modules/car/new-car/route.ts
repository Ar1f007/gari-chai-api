import express from 'express';

import { createCarHandler, getCarHandler, getCarsHandler, updateCarHandler } from './controller';
import { createNewCarSchema, getCarSchema, updateCarSchema } from './schema';
import { validateResource } from '../../../middleware';

export const carRouter = express.Router();

carRouter.route('/').get(getCarsHandler).post(validateResource(createNewCarSchema), createCarHandler);

carRouter
  .route('/:carSlug')
  .get(validateResource(getCarSchema), getCarHandler)
  .put(validateResource(updateCarSchema), updateCarHandler);
