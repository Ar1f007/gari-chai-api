import express from 'express';
import {
  createCarCampaignHandler,
  deleteCarCampaignHandler,
  getAllCarCampaignsHandler,
  updateCarCampaignHandler,
} from './controller';
import { validateResource } from '../../middleware';
import { createCarCampaignSchema, deleteCarCampaignSchema } from './schema';

const campaignRouter = express.Router();

campaignRouter
  .route('/cars')
  .post(validateResource(createCarCampaignSchema), createCarCampaignHandler)
  .get(getAllCarCampaignsHandler);

campaignRouter
  .route('/cars/:id')
  .patch(validateResource(createCarCampaignSchema), updateCarCampaignHandler)
  .delete(validateResource(deleteCarCampaignSchema), deleteCarCampaignHandler);

export default campaignRouter;
