import { SliderModel } from './model';
import { CreateSliderInputs } from './schema';

export async function createSlider(input: CreateSliderInputs) {
  return SliderModel.create(input);
}
