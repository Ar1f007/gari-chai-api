import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import BrandModel, { BrandModelDocument } from './model';
import { CreateNewBrandModelInputs } from './schema';
import mongoose from 'mongoose';

export async function createNewBrandModel(input: CreateNewBrandModelInputs) {
  return BrandModel.create(input);
}

export async function findBrandModel(query: FilterQuery<BrandModelDocument>, options: QueryOptions = { lean: true }) {
  const result = await BrandModel.findOne(query, {}, options);

  return result;
}

export async function findModelsByBrand(
  query: FilterQuery<BrandModelDocument>,
  options: QueryOptions = { lean: true },
) {
  const result = await BrandModel.find(query, {}, options);

  return result;
}

export async function findBrandModels(
  query: FilterQuery<BrandModelDocument> = {},
  options: QueryOptions = { lean: true },
) {
  const results = await BrandModel.find(query, {}, options);

  return results;
}

export async function findAndUpdateBrandModel(
  query: FilterQuery<BrandModelDocument>,
  update: UpdateQuery<BrandModelDocument>,
  options: QueryOptions,
) {
  return BrandModel.findOneAndUpdate(query, update, options);
}

export async function deleteBrandModel(query: FilterQuery<BrandModelDocument>) {
  return BrandModel.deleteOne(query);
}

export async function updateBrandModelCarCollectionCount({
  type,
  brandModelId,
}: {
  type: 'inc' | 'dec';
  brandModelId: mongoose.Types.ObjectId | string;
}) {
  const brandModel = await BrandModel.findOneAndUpdate(
    { _id: brandModelId },
    {
      $inc: {
        carCollectionCount: type === 'inc' ? 1 : -1,
      },
    },
    {
      new: true,
    },
  );

  return brandModel;
}
