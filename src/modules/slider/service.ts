import { SliderModel } from './model';
import { CreateSliderInputs } from './schema';

export async function createSlider(input: CreateSliderInputs) {
  return SliderModel.create(input);
}

export async function getSliders() {
  return SliderModel.find().lean();
}
