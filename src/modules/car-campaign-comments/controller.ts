import { Request, Response } from 'express';
import { CreateNewCarCampaignComment, ReadCommentsForCampaign } from './schema';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';
import { createCarCampaignComment, findCarCampaignComments } from './service';
import mongoose from 'mongoose';

export async function createNewCommentHandler(
  req: Request<{}, {}, CreateNewCarCampaignComment['body']>,
  res: Response,
) {
  const comment = await createCarCampaignComment({
    content: req.body.content,
    user: req.body.user,
    car: req.body.car,
    campaign: req.body.campaign,
    carType: req.body.carType,
  });

  if (!comment) {
    throw new AppError('Could not create campaign', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: comment,
    message: 'Comment added successfully',
  });
}

export async function getCampaignCommentsHandler(
  req: Request<ReadCommentsForCampaign['params'], {}, {}>,
  res: Response,
) {
  const { campaignId, carId } = req.params;

  const comments = await findCarCampaignComments(
    {
      campaign: new mongoose.Types.ObjectId(campaignId),
      car: new mongoose.Types.ObjectId(carId),
    },
    {
      populate: [{ path: 'user', select: 'firstName lastName profilePicture' }],
    },
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: comments,
    message: '',
  });
}
