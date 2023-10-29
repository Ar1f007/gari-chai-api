import HomeSetting from './model';
import { CreateHomeSettingInputs } from './schema';

export async function createNewHomeSetting(input: CreateHomeSettingInputs) {
  const res = await HomeSetting.create(input);

  return res;
}
