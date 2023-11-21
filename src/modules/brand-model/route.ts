import express from 'express';

import {
  createBrandModelHandler,
  deleteBrandModelHandler,
  getBrandModelHandler,
  getBrandModelsHandler,
  updateBrandModelHandler,
} from './controller';

import { createBrandModelSchema, deleteBrandModelSchema, getBrandModelSchema, updateBrandModelSchema } from './schema';

import { validateResource } from '../../middleware';

export const brandModelRouter = express.Router();

brandModelRouter
  .route('/')
  .get(getBrandModelsHandler)
  .post(validateResource(createBrandModelSchema), createBrandModelHandler);

brandModelRouter
  .route('/:brandModelSlug')
  .get(validateResource(getBrandModelSchema), getBrandModelHandler)
  .put(validateResource(updateBrandModelSchema), updateBrandModelHandler)
  .delete(validateResource(deleteBrandModelSchema), deleteBrandModelHandler);
