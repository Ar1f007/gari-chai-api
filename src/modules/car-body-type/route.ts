import express from 'express';
import { validateResource } from '../../middleware';
import { carBodyTypeCreateSchema } from './schema';
import { createCarBodyTypeHandler, getAllBodyTypesHandler } from './controller';

const carBodyTypeRouter = express.Router();

carBodyTypeRouter
  .route('/')
  .post(validateResource(carBodyTypeCreateSchema), createCarBodyTypeHandler)
  .get(getAllBodyTypesHandler);

export default carBodyTypeRouter;
