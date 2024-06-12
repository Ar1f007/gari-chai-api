import express from 'express';
import { authenticated, validateResource } from '../../middleware';
import { createComForNewCarCampaign, getComForCampaign } from './schema';
import { createNewCommentHandler, getCampaignCommentsHandler } from './controller';

const campaignCommentRouter = express.Router();

campaignCommentRouter
  .route('/cars')
  .post(authenticated, validateResource(createComForNewCarCampaign), createNewCommentHandler);

campaignCommentRouter.route('/:campaignId/:carId').get(validateResource(getComForCampaign), getCampaignCommentsHandler);
export default campaignCommentRouter;
