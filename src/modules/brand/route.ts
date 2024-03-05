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

import { authenticated, validateResource } from '../../middleware';

export const brandRouter = express.Router();

brandRouter
  .route('/')
  .get(getBrandsHandler)
  .post(authenticated, validateResource(createBrandSchema), createBrandHandler)
  .delete(authenticated, deleteBrandHandler);

brandRouter.get('/all-with-popular', getAllAndPopularBrandsHandler); // used in search box in the ui

brandRouter
  .route('/:brandSlug')
  .get(validateResource(getBrandSchema), getBrandHandler)
  .patch(authenticated, validateResource(updateBrandSchema), updateBrandHandler);
