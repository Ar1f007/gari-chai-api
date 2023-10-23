import Car from './model';
import { CreateNewCarInputs } from './schema';

export const createNewCar = async (input: CreateNewCarInputs) => {
  try {
    const car = await Car.create(input);

    return car;
  } catch (e: any) {
    throw e;
  }
};
