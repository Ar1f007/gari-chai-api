import express from 'express';

import {
  createBrandHandler,
  deleteBrandHandler,
  getBrandHandler,
  getBrandsHandler,
  updateBrandHandler,
} from './controller';

import { createBrandSchema, deleteBrandSchema, getBrandSchema, updateBrandSchema } from './schema';

import { validateResource } from '../../middleware';

export const brandRouter = express.Router();

brandRouter.route('/').get(getBrandsHandler).post(validateResource(createBrandSchema), createBrandHandler);

brandRouter
  .route('/:brandSlug')
  .get(validateResource(getBrandSchema), getBrandHandler)
  .put(validateResource(updateBrandSchema), updateBrandHandler)
  .delete(validateResource(deleteBrandSchema), deleteBrandHandler);
