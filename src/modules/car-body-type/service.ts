import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import CarBodyTypeModel, { CarBodyTypeDocument } from './model';
import { CarBodyTypeCreateParams } from './schema';

export function createBodyType(input: CarBodyTypeCreateParams) {
  return CarBodyTypeModel.create(input);
}

export function findBodyType(query: FilterQuery<CarBodyTypeDocument>, options: QueryOptions = { lean: true }) {
  return CarBodyTypeModel.findOne(query, {}, options);
}

export function findAllBodyTypes(query: FilterQuery<CarBodyTypeDocument> = {}, options: QueryOptions = { lean: true }) {
  return CarBodyTypeModel.find(query, {}, options);
}

export function deleteBodyType(id: string) {
  return CarBodyTypeModel.findByIdAndDelete(id);
}

export async function findAndUpdateCarBodyType(
  query: FilterQuery<CarBodyTypeDocument>,
  update: UpdateQuery<CarBodyTypeDocument>,
  options: QueryOptions,
) {
  return CarBodyTypeModel.findOneAndUpdate(query, update, options);
}
