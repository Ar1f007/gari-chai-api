import express from 'express';
import { createCarPartHandler, deleteCarPartHandler, getCarPartsHandler } from './controller';
import { authenticated, validateResource } from '../../middleware';
import { createCarPartSchema, deleteCarPartSchema } from './schema';

export const carPartRouter = express.Router();

carPartRouter
  .route('/')
  .get(getCarPartsHandler)
  .post(authenticated, validateResource(createCarPartSchema), createCarPartHandler);

carPartRouter.route('/:id').delete(authenticated, validateResource(deleteCarPartSchema), deleteCarPartHandler);
