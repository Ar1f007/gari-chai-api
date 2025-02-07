import express from 'express';
import {
  createCarPartHandler,
  deleteCarPartHandler,
  getCarPartHandler,
  getCarPartsHandler,
  updateCarPartHandler,
} from './controller';
import { authenticated, validateResource } from '../../middleware';
import { createCarPartSchema, deleteCarPartSchema, readCarPartSchema } from './schema';

export const carPartRouter = express.Router();

carPartRouter
  .route('/')
  .get(getCarPartsHandler)
  .post(authenticated, validateResource(createCarPartSchema), createCarPartHandler)
  .patch(authenticated, updateCarPartHandler);

carPartRouter.get('/:slug', validateResource(readCarPartSchema), getCarPartHandler);

carPartRouter.route('/:id').delete(authenticated, validateResource(deleteCarPartSchema), deleteCarPartHandler);
