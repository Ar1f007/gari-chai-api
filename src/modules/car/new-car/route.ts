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
import { authenticated, validateResource } from '../../../middleware';

export const carRouter = express.Router();

carRouter
  .route('/')
  .get(validateResource(getCarQuerySchema), getCarsHandler)
  .post(authenticated, validateResource(createNewCarSchema), createCarHandler)
  .delete(authenticated, validateResource(deleteCarByIdSchema), deleteCarByIdHandler);

carRouter
  .route('/:carSlug')
  .get(validateResource(getCarSchema), getCarHandler)
  .put(authenticated, validateResource(updateCarSchema), updateCarHandler)
  .delete(authenticated, validateResource(deleteCarSchema), deleteCarHandler);
