import { FilterQuery, QueryOptions } from 'mongoose';
import CarInformationModel, { CarInformationDocument } from './model';
import { VehicleTypeCreateInputs } from './schema';

export function createVehicleType(input: VehicleTypeCreateInputs) {
  return CarInformationModel.create(input);
}

export function findFromCarInformation(
  query: FilterQuery<CarInformationDocument>,
  options: QueryOptions = { lean: true },
) {
  return CarInformationModel.findOne(query, {}, options);
}
