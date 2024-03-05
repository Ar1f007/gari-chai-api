import express from 'express';
import { authenticated, validateResource } from '../../middleware';
import { addVendorSchema, updateVendorInfoSchema } from './schema';
import { createVendorHandler, deleteVendorHandler, getAllVendorsHandler, updateVendorInfoHandler } from './controller';

const vendorRouter = express.Router();

vendorRouter
  .route('/')
  .post(authenticated, validateResource(addVendorSchema), createVendorHandler)
  .get(getAllVendorsHandler)
  .delete(authenticated, deleteVendorHandler);

vendorRouter.route('/:id').patch(authenticated, validateResource(updateVendorInfoSchema), updateVendorInfoHandler);

export default vendorRouter;
