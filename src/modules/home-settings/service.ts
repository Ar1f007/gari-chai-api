import { FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
import HomeSetting, { HomeSettingDocument } from './model';
import { CreateHomeSettingInputs } from './schema';

export async function createNewHomeSetting(input: CreateHomeSettingInputs) {
  const res = await HomeSetting.create(input);

  return res;
}

export async function createManyHomeSetting(input: any) {
  const res = await HomeSetting.insertMany(input);

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
  projections: ProjectionType<HomeSettingDocument> = {},
  options: QueryOptions = { lean: true },
) {
  const res = await HomeSetting.find(query, projections, options);
  return res;
}

export async function findAndUpdateSettingItem(
  query: FilterQuery<HomeSettingDocument>,
  update: UpdateQuery<HomeSettingDocument>,
  options: QueryOptions,
) {
  return HomeSetting.findOneAndUpdate(query, update, options);
}

export async function deleteSettingItem(query: FilterQuery<HomeSettingDocument>) {
  return HomeSetting.deleteOne(query);
}
