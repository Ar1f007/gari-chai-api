import express from 'express';
import { createCarCampaignHandler, getAllCarCampaignsHandler } from './controller';
import { authenticated, validateResource } from '../../middleware';
import { createCarCampaignSchema } from './schema';

const campaignRouter = express.Router();

campaignRouter
  .route('/cars')
  .post(authenticated, validateResource(createCarCampaignSchema), createCarCampaignHandler)
  .get(getAllCarCampaignsHandler);

export default campaignRouter;
