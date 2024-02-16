import express from 'express';
import { validateResource } from '../../middleware';
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
  .post(validateResource(carBodyTypeCreateSchema), createCarBodyTypeHandler)
  .get(getAllBodyTypesHandler)

  .delete(deleteBodyTypeHandler);

carBodyTypeRouter.route('/:id').patch(validateResource(updateBodyTypeSchema), updateCarBodyTypeHandler);

export default carBodyTypeRouter;
