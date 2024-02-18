import { CampaignModel, CarCampaignModel } from './model';
import { CreateCarCampaignInputs } from './schema';
import { ValidMongoIdSchema } from '../../lib/zod/commonSchemas';
import { FilterQuery, QueryOptions } from 'mongoose';

export type CreateCarCampaignParams = Omit<CreateCarCampaignInputs, 'cars'> & {
  newCars: ValidMongoIdSchema[];
  usedCars: ValidMongoIdSchema[];
};
export async function createCarCampaign(input: CreateCarCampaignParams) {
  return CarCampaignModel.create(input);
}

export async function findCampaigns<T>(
  query: FilterQuery<T> = {},
  options: QueryOptions = { lean: true },
  sortOptions: string = '-launchedAt',
) {
  const results = await CampaignModel.find(query, {}, options).sort(sortOptions);

  return results;
}
