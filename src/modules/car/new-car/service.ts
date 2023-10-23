import Car from './model';
import { CreateNewCarInputs } from './schema';

export const createNewCar = async (input: CreateNewCarInputs) => {
  const car = await Car.create(input);

  return car;
};
