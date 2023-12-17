import express from 'express';

import {
  createBrandModelHandler,
  deleteBrandModelHandler,
  getModelsByBrand,
  getBrandModelsHandler,
  updateBrandModelHandler,
} from './controller';

import { createBrandModelSchema, getBrandModelSchema, updateBrandModelSchema } from './schema';

import { validateResource } from '../../middleware';

export const brandModelRouter = express.Router();

brandModelRouter
  .route('/')
  .get(getBrandModelsHandler)
  .post(validateResource(createBrandModelSchema), createBrandModelHandler)
  .delete(deleteBrandModelHandler);

brandModelRouter
  .route('/:id')
  .get(validateResource(getBrandModelSchema), getModelsByBrand)
  .put(validateResource(updateBrandModelSchema), updateBrandModelHandler);
