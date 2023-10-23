import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import UsedCar, { UsedCarDocument } from './model';
import { CreateUsedCarInputs } from './schema';

export async function createUsedNewCar(input: CreateUsedCarInputs) {
  const result = await UsedCar.create(input);

  return result;
}

export async function findUsedCar(query: FilterQuery<UsedCarDocument>, options: QueryOptions = { lean: true }) {
  const result = await UsedCar.findOne(query, {}, options);

  return result;
}

export async function findUsedCars(query: FilterQuery<UsedCarDocument> = {}, options: QueryOptions = { lean: true }) {
  const results = await UsedCar.find(query, {}, options);

  return results;
}

export async function findAndUpdateUsedCar(
  query: FilterQuery<UsedCarDocument>,
  update: UpdateQuery<UsedCarDocument>,
  options: QueryOptions,
) {
  return UsedCar.findOneAndUpdate(query, update, options);
}

export async function deleteUsedCar(query: FilterQuery<UsedCarDocument>) {
  return UsedCar.deleteOne(query);
}
