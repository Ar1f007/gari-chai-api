import express from 'express';
import { createCarPartHandler, getCarPartsHandler } from './controller';
import { authenticated, validateResource } from '../../middleware';
import { createCarPartSchema } from './schema';

export const carPartRouter = express.Router();

carPartRouter
  .route('/')
  .get(getCarPartsHandler)
  .post(authenticated, validateResource(createCarPartSchema), createCarPartHandler);
