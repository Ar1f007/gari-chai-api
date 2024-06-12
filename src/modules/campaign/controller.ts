import { Request, Response } from 'express';
import { CreateCarCampaignInputs, DeleteCarCampaignInputs, GetCampaigns, UpdateCarCampaignInputs } from './schema';
import {
  CreateCarCampaignParams,
  createCarCampaign,
  deleteCarCampaign,
  findAndUpdateCarCampaign,
  findCampaigns,
} from './service';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';
import { CAR_CAMPAIGN, CAR_CAMPAIGN_POPULATE_NEW_CARS } from '../../constants';

export async function createCarCampaignHandler(req: Request<{}, {}, CreateCarCampaignInputs>, res: Response) {
  const cars = req.body.cars;

  const { newCars, usedCars } = cars.reduce(
    (acc, cur) => {
      if (cur.type == 'new') {
        acc.newCars.push({
          car: cur.carId,
          campaignPrice: cur.campaignPrice,
        });
      } else {
        acc.usedCars.push({
          car: cur.carId,
          campaignPrice: cur.campaignPrice,
        });
      }

      return acc;
    },
    {
      newCars: [] as CreateCarCampaignParams['newCars'],
      usedCars: [] as CreateCarCampaignParams['usedCars'],
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

  queryFilters['endDate'] = { $gte: new Date() };

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

export async function updateCarCampaignHandler(
  req: Request<UpdateCarCampaignInputs['params'], {}, UpdateCarCampaignInputs['body']>,
  res: Response,
) {
  const cars = req.body.cars;

  const campaignId = req.params.id;

  const { newCars, usedCars } = cars.reduce(
    (acc, cur) => {
      if (cur.type == 'new') {
        acc.newCars.push({
          car: cur.carId,
          campaignPrice: cur.campaignPrice,
        });
      } else {
        acc.usedCars.push({
          car: cur.carId,
          campaignPrice: cur.campaignPrice,
        });
      }

      return acc;
    },
    {
      newCars: [] as CreateCarCampaignParams['newCars'],
      usedCars: [] as CreateCarCampaignParams['usedCars'],
    },
  );

  const campaignData: CreateCarCampaignParams = {
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

  const campaign = await findAndUpdateCarCampaign(
    {
      _id: campaignId,
      __t: CAR_CAMPAIGN,
    },
    campaignData,
    {
      new: true,
    },
  );

  if (!campaign) {
    throw new AppError('Could not create campaign', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: campaign,
    message: 'Campaign info updated successfully',
  });
}

export async function deleteCarCampaignHandler(req: Request<DeleteCarCampaignInputs>, res: Response) {
  const campaignId = req.params.id;

  const campaign = await deleteCarCampaign({ _id: campaignId });

  if (!campaign) {
    throw new AppError('No campaign was found', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Campaign was deleted',
  });
}
