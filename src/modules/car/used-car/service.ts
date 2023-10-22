import UsedCar from './model';
import { CreateUsedCarInputs } from './schema';

export const createUsedCar = async (input: CreateUsedCarInputs) => {
  try {
    const car = await UsedCar.create(input);
    return car;
  } catch (e) {
    throw e;
  }
};
