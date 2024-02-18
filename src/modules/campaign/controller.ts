import { Request, Response } from 'express';
import { CreateCarCampaignInputs } from './schema';
import { CreateCarCampaignParams, createCarCampaign, findCampaigns } from './service';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';

export async function createCarCampaignHandler(req: Request<{}, {}, CreateCarCampaignInputs>, res: Response) {
  const cars = req.body.cars;

  const { newCars, usedCars } = cars.reduce(
    (acc, cur) => {
      if (cur.type == 'new') {
        acc.newCars.push(cur.carId);
      } else {
        acc.usedCars.push(cur.carId);
      }

      return acc;
    },
    {
      newCars: [] as CreateCarCampaignParams['usedCars'],
      usedCars: [] as CreateCarCampaignParams['newCars'],
    },
  );

  const newCampaignData: CreateCarCampaignParams = {
    title: req.body.title,
    tagline: req.body.tagline,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    isActive: req.body.isActive,
    metaData: req.body.metaData,
    posterImage: req.body.posterImage,
    description: req.body.description,
    newCars,
    usedCars,
  };

  const campaign = await createCarCampaign(newCampaignData);

  if (!campaign) {
    throw new AppError('Could not create campaign', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: campaign,
    message: 'Campaign created successfully',
  });
}

export async function getAllCarCampaignsHandler(_: Request, res: Response) {
  const campaigns = await findCampaigns(
    { __t: 'CarCampaign' },
    {
      populate: [
        {
          path: 'newCars',
        },
        // {
        // path: 'usedCars',
        // },
      ],
    },
  );

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: campaigns,
  });
}
