import express from 'express';

import {
  createBrandHandler,
  deleteBrandHandler,
  getAllAndPopularBrandsHandler,
  getBrandHandler,
  getBrandsHandler,
  updateBrandHandler,
} from './controller';

import { createBrandSchema, getBrandSchema, updateBrandSchema } from './schema';

import { validateResource } from '../../middleware';

export const brandRouter = express.Router();

brandRouter
  .route('/')
  .get(getBrandsHandler)
  .post(validateResource(createBrandSchema), createBrandHandler)
  .delete(deleteBrandHandler);

brandRouter.get('/all-with-popular', getAllAndPopularBrandsHandler); // used in search box

brandRouter
  .route('/:brandSlug')
  .get(validateResource(getBrandSchema), getBrandHandler)
  .put(validateResource(updateBrandSchema), updateBrandHandler);
