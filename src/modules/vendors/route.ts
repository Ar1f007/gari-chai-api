import express from 'express';
import { validateResource } from '../../middleware';
import { addVendorSchema } from './schema';
import { createVendorHandler, deleteVendorHandler, getAllVendorsHandler } from './controller';

const vendorRouter = express.Router();

vendorRouter
  .route('/')
  .post(validateResource(addVendorSchema), createVendorHandler)
  .get(getAllVendorsHandler)
  .delete(deleteVendorHandler);

export default vendorRouter;
