import CarModel, { CarDocument } from './model';
import { CarInputs } from './schema';

export const createCar = async (input: CarInputs) => {
  try {
    const car = await CarModel.create(input);

    return car;
  } catch (e) {
    throw e;
  }
};
