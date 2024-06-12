import express from 'express';
import { authenticated, validateResource } from '../../middleware';
import { carBodyTypeCreateSchema, updateBodyTypeSchema } from './schema';
import {
  createCarBodyTypeHandler,
  deleteBodyTypeHandler,
  getAllBodyTypesHandler,
  updateCarBodyTypeHandler,
} from './controller';

const carBodyTypeRouter = express.Router();

carBodyTypeRouter
  .route('/')
  .post(authenticated, validateResource(carBodyTypeCreateSchema), createCarBodyTypeHandler)
  .get(getAllBodyTypesHandler)

  .delete(authenticated, deleteBodyTypeHandler);

carBodyTypeRouter.route('/:id').patch(authenticated, validateResource(updateBodyTypeSchema), updateCarBodyTypeHandler);

export default carBodyTypeRouter;
