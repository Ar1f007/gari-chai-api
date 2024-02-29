import express from 'express';
import { createCarCampaignHandler, getAllCarCampaignsHandler, updateCarCampaignHandler } from './controller';
import { validateResource } from '../../middleware';
import { createCarCampaignSchema } from './schema';

const campaignRouter = express.Router();

campaignRouter
  .route('/cars')
  .post(validateResource(createCarCampaignSchema), createCarCampaignHandler)
  .get(getAllCarCampaignsHandler);

campaignRouter.route('/cars/:id').patch(validateResource(createCarCampaignSchema), updateCarCampaignHandler);

export default campaignRouter;
