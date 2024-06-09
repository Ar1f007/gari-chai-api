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
  options: QueryOptions = {},
) {
  return HomeSetting.findOneAndUpdate(query, update, options);
}

export async function findAndUpdateManySettingItem(
  query: FilterQuery<HomeSettingDocument>,
  update: UpdateQuery<HomeSettingDocument>,
) {
  return HomeSetting.updateMany(query, update);
}

export async function deleteSettingItem(query: FilterQuery<HomeSettingDocument>) {
  return HomeSetting.deleteMany(query);
}

export async function updateHomeSettingContentData({ content }: { content: any }) {
  try {
    if (!content._id) return;

    // check if actually there is a content added with this id
    // if not ? -> then don't do anything
    // if there ? -> then replace the content part

    findAndUpdateManySettingItem({ contentId: content._id }, { $set: { content } });
  } catch (error) {
    // TODO : HANDLE ERROR
  }
}
