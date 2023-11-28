import { FilterQuery, QueryOptions } from 'mongoose';
import CarBodyTypeModel, { CarBodyTypeDocument } from './model';
import { CarBodyTypeCreateInputs } from './schema';

export function createBodyType(input: CarBodyTypeCreateInputs) {
  return CarBodyTypeModel.create(input);
}

export function findBodyType(query: FilterQuery<CarBodyTypeDocument>, options: QueryOptions = { lean: true }) {
  return CarBodyTypeModel.findOne(query, {}, options);
}

export function findAllBodyTypes(query: FilterQuery<CarBodyTypeDocument> = {}, options: QueryOptions = { lean: true }) {
  return CarBodyTypeModel.find(query, {}, options);
}
