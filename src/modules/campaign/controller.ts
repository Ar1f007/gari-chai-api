import { Request, Response } from 'express';
import { CreateCarCampaignInputs, GetCampaigns } from './schema';
import { CreateCarCampaignParams, createCarCampaign, findCampaigns } from './service';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';
import { CAR_CAMPAIGN, CAR_CAMPAIGN_POPULATE_NEW_CARS } from '../../constants';

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

export async function getAllCarCampaignsHandler(req: Request<{}, {}, {}, GetCampaigns['query']>, res: Response) {
  const queryFilters: Record<string, any> = {};

  if (req.query.status) {
    queryFilters['isActive'] = req.query.status == 'active' ? true : req.query.status == 'hidden' ? false : true;
  }

  queryFilters['__t'] = CAR_CAMPAIGN;

  const campaigns = await findCampaigns(queryFilters, {
    populate: [
      {
        path: CAR_CAMPAIGN_POPULATE_NEW_CARS,
      },
      // {
      // path: 'usedCars',
      // },
    ],
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: campaigns,
  });
}
