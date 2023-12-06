import { SliderModel } from './model';
import { CreateSliderInputs, SliderId, UpdateSliderInputs } from './schema';

export async function createSlider(input: CreateSliderInputs) {
  return SliderModel.create(input);
}

export async function findSlider(input: SliderId['id']) {
  return SliderModel.findOne({ _id: input });
}

export async function getSliders() {
  return SliderModel.find().lean();
}

export async function updateSlider(id: SliderId['id'], input: UpdateSliderInputs) {
  return SliderModel.findByIdAndUpdate(id, input, {
    new: true,
  });
}

export async function deleteSlider(id: SliderId['id']) {
  return SliderModel.findByIdAndDelete(id);
}
