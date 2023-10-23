import express from 'express';

import { createCarHandler, deleteCarHandler, getCarHandler, getCarsHandler, updateCarHandler } from './controller';
import { createNewCarSchema, deleteCarSchema, getCarSchema, updateCarSchema } from './schema';
import { validateResource } from '../../../middleware';

export const carRouter = express.Router();

carRouter.route('/').get(getCarsHandler).post(validateResource(createNewCarSchema), createCarHandler);

carRouter
  .route('/:carSlug')
  .get(validateResource(getCarSchema), getCarHandler)
  .put(validateResource(updateCarSchema), updateCarHandler)
  .delete(validateResource(deleteCarSchema), deleteCarHandler);
