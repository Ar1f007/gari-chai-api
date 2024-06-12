import express from 'express';

import {
  createBrandModelHandler,
  deleteBrandModelHandler,
  getModelsByBrand,
  getBrandModelsHandler,
  updateBrandModelHandler,
} from './controller';

import { createBrandModelSchema, getBrandModelSchema, updateBrandModelSchema } from './schema';

import { authenticated, validateResource } from '../../middleware';

export const brandModelRouter = express.Router();

brandModelRouter
  .route('/')
  .get(getBrandModelsHandler)
  .post(authenticated, validateResource(createBrandModelSchema), createBrandModelHandler)
  .delete(authenticated, deleteBrandModelHandler);

brandModelRouter
  .route('/:id')
  .get(validateResource(getBrandModelSchema), getModelsByBrand)
  .patch(authenticated, validateResource(updateBrandModelSchema), updateBrandModelHandler);
