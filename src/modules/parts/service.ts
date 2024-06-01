import { FilterQuery, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

import { CarPartDocument, CarPartModel } from './model';
import { CreateCarPartInputs } from './schema';

export async function createNewCarPart(payload: CreateCarPartInputs) {
  return CarPartModel.create(payload);
}

export async function findCarPart(query: FilterQuery<CarPartDocument>, options: QueryOptions = { lean: true }) {
  const result = await CarPartModel.findOne(query, {}, options);

  return result;
}

export async function findCarParts(
  query: FilterQuery<CarPartDocument> = {},
  projections: ProjectionType<CarPartDocument> = {},
  options: QueryOptions = { lean: true },
) {
  const results = await CarPartModel.find(query, projections, options);

  return results;
}

export async function findAndUpdateCarPart(
  query: FilterQuery<CarPartDocument>,
  update: UpdateQuery<CarPartDocument>,
  options: QueryOptions,
) {
  return CarPartModel.findOneAndUpdate(query, update, options);
}

export async function deleteCarPart(query: FilterQuery<CarPartDocument>) {
  return CarPartModel.deleteOne(query);
}
