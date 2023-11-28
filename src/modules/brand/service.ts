import mongoose, { FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';
import BrandModel, { BrandDocument } from './model';
import { CreateNewBrandInputs } from './schema';

export async function createNewBrand(input: CreateNewBrandInputs) {
  return BrandModel.create(input);
}

export async function findBrand(query: FilterQuery<BrandDocument>, options: QueryOptions = { lean: true }) {
  const result = await BrandModel.findOne(query, {}, options);

  return result;
}

export async function findBrands(
  query: FilterQuery<BrandDocument> = {},
  projections: ProjectionType<BrandDocument> = {},
  options: QueryOptions = { lean: true },
) {
  const results = await BrandModel.find(query, projections, options);

  return results;
}

export async function findAndUpdateBrand(
  query: FilterQuery<BrandDocument>,
  update: UpdateQuery<BrandDocument>,
  options: QueryOptions,
) {
  return BrandModel.findOneAndUpdate(query, update, options);
}

export async function deleteBrand(query: FilterQuery<BrandDocument>) {
  return BrandModel.deleteOne(query);
}

export async function updateBrandCarCollectionCount({
  type,
  brandId,
}: {
  type: 'inc' | 'dec';
  brandId: mongoose.Types.ObjectId | string;
}) {
  const brand = await BrandModel.findOneAndUpdate(
    { _id: brandId },
    {
      $inc: {
        carCollectionCount: type === 'inc' ? 1 : -1,
      },
    },
    {
      new: true,
    },
  );

  return brand;
}
