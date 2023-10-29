import { FilterQuery, QueryOptions } from 'mongoose';
import HomeSetting, { HomeSettingDocument } from './model';
import { CreateHomeSettingInputs } from './schema';

export async function createNewHomeSetting(input: CreateHomeSettingInputs) {
  const res = await HomeSetting.create(input);

  return res;
}

export async function findSettingContent(
  query: FilterQuery<HomeSettingDocument>,
  options: QueryOptions = { lean: true },
) {
  const result = await HomeSetting.findOne(query, {}, options);

  return result;
}

export async function findSettingContents(
  query: FilterQuery<HomeSettingDocument> = {},
  options: QueryOptions = { lean: true },
) {
  const res = await HomeSetting.find(query, {}, options);
  return res;
}
