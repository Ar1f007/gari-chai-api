import express from 'express';
import { validateResource } from '../../middleware';
import { addVendorSchema, updateVendorInfoSchema } from './schema';
import { createVendorHandler, deleteVendorHandler, getAllVendorsHandler, updateVendorInfoHandler } from './controller';

const vendorRouter = express.Router();

vendorRouter
  .route('/')
  .post(validateResource(addVendorSchema), createVendorHandler)
  .get(getAllVendorsHandler)
  .delete(deleteVendorHandler);

vendorRouter.route('/:id').patch(validateResource(updateVendorInfoSchema), updateVendorInfoHandler);

export default vendorRouter;
