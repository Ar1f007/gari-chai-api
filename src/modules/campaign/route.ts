import express from 'express';
import {
  createCarCampaignHandler,
  deleteCarCampaignHandler,
  getAllCarCampaignsHandler,
  updateCarCampaignHandler,
} from './controller';
import { authenticated, validateResource } from '../../middleware';
import { createCarCampaignSchema, deleteCarCampaignSchema } from './schema';

const campaignRouter = express.Router();

campaignRouter
  .route('/cars')
  .post(authenticated, validateResource(createCarCampaignSchema), createCarCampaignHandler)
  .get(getAllCarCampaignsHandler);

campaignRouter
  .route('/cars/:id')
  .patch(authenticated, validateResource(createCarCampaignSchema), updateCarCampaignHandler)
  .delete(authenticated, validateResource(deleteCarCampaignSchema), deleteCarCampaignHandler);

export default campaignRouter;
