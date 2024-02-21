import express from 'express';
import { validateResource } from '../../middleware';
import { createComForNewCarCampaign, getComForCampaign } from './schema';
import { createNewCommentHandler, getCampaignCommentsHandler } from './controller';

const campaignCommentRouter = express.Router();

campaignCommentRouter.route('/cars').post(validateResource(createComForNewCarCampaign), createNewCommentHandler);

campaignCommentRouter.route('/:campaignId/:carId').get(validateResource(getComForCampaign), getCampaignCommentsHandler);
export default campaignCommentRouter;
