import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import Car, { CarDocument } from './model';
import { CreateNewCarInputs } from './schema';

export async function createNewCar(input: CreateNewCarInputs) {
  const car = await Car.create(input);

  return car;
}

export async function findCar(query: FilterQuery<CarDocument>, options: QueryOptions = { lean: true }) {
  const result = await Car.findOne(query, {}, options);

  return result;
}

export async function findCars(
  query: FilterQuery<CarDocument> = {},
  options: QueryOptions = { lean: true },
  sortOptions: string = '-launchedAt',
) {
  const results = await Car.find(query, {}, options).sort(sortOptions);

  return results;
}

export async function findAndUpdateCar(
  query: FilterQuery<CarDocument>,
  update: UpdateQuery<CarDocument>,
  options: QueryOptions<CarDocument> = {},
) {
  return Car.findOneAndUpdate(query, update, options);
}

export async function findAndUpdateManyCar(
  query: FilterQuery<CarDocument>,
  update: UpdateQuery<CarDocument>,
  // options: QueryOptions<CarDocument> = {},
) {
  return Car.updateMany(query, update);
}

export async function deleteCar(query: FilterQuery<CarDocument>) {
  return Car.deleteOne(query);
}

// New method for counting documents
export async function countCars(query: FilterQuery<CarDocument>) {
  return Car.countDocuments(query);
}
