import express from 'express';

import {
  createCarHandler,
  deleteCarByIdHandler,
  deleteCarHandler,
  getCarHandler,
  getCarsHandler,
  updateCarHandler,
} from './controller';
import {
  createNewCarSchema,
  deleteCarByIdSchema,
  deleteCarSchema,
  getCarQuerySchema,
  getCarSchema,
  updateCarSchema,
} from './schema';
import { validateResource } from '../../../middleware';

export const carRouter = express.Router();

carRouter
  .route('/')
  .get(validateResource(getCarQuerySchema), getCarsHandler)
  .post(validateResource(createNewCarSchema), createCarHandler)
  .delete(validateResource(deleteCarByIdSchema), deleteCarByIdHandler);

carRouter
  .route('/:carSlug')
  .get(validateResource(getCarSchema), getCarHandler)
  .put(validateResource(updateCarSchema), updateCarHandler)
  .delete(validateResource(deleteCarSchema), deleteCarHandler);
