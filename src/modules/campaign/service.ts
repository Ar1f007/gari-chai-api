import { CampaignDocument, CampaignModel, CarCampaignModel } from './model';
import { CreateCarCampaignInputs } from './schema';
import { TMinMaxPriceSchema, ValidMongoIdSchema } from '../../lib/zod/commonSchemas';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';

export type CreateCarCampaignParams = Omit<CreateCarCampaignInputs, 'cars'> & {
  newCars: {
    car: ValidMongoIdSchema;
    campaignPrice: TMinMaxPriceSchema;
  }[];
  usedCars: {
    car: ValidMongoIdSchema;
    campaignPrice: TMinMaxPriceSchema;
  }[];
};
export async function createCarCampaign(input: CreateCarCampaignParams) {
  return CarCampaignModel.create(input);
}

export async function findAndUpdateCarCampaign(
  query: FilterQuery<CampaignDocument>,
  update: UpdateQuery<CampaignDocument>,
  options: QueryOptions,
) {
  return CampaignModel.findOneAndUpdate(query, update, options);
}

export async function findCampaigns<T>(
  query: FilterQuery<T> = {},
  options: QueryOptions = { lean: true },
  sortOptions: string = '-launchedAt',
) {
  const results = await CampaignModel.find(query, {}, options).sort(sortOptions);

  return results;
}

export async function deleteCarCampaign(query: FilterQuery<CampaignDocument>) {
  return CampaignModel.deleteOne(query);
}
