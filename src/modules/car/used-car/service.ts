import UsedCar from './model';
import { CreateUsedCarInputs } from './schema';

export const createUsedCar = async (input: CreateUsedCarInputs) => {
  const car = await UsedCar.create(input);
  return car;
};
