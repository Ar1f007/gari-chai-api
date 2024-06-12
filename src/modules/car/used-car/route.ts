// import express from 'express';

// import {
//   createUsedCarHandler,
//   getUsedCarHandler,
//   getUsedCarsHandler,
//   updateUsedCarHandler,
//   deleteUsedCarHandler,
// } from './controller';
// import { createUsedCarSchema, deleteUsedCarSchema, getUsedCarSchema, updateUsedCarSchema } from './schema';
// import { validateResource } from '../../../middleware';

// export const usedCarRouter = express.Router();

// usedCarRouter.route('/').get(getUsedCarsHandler).post(validateResource(createUsedCarSchema), createUsedCarHandler);

// usedCarRouter
//   .route('/:carSlug')
//   .get(validateResource(getUsedCarSchema), getUsedCarHandler)
//   .put(validateResource(updateUsedCarSchema), updateUsedCarHandler)
//   .delete(validateResource(deleteUsedCarSchema), deleteUsedCarHandler);
