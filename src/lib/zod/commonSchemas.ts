import mongoose from 'mongoose';
import { z } from 'zod';

export const validMongoIdSchema = z.union([
  z
    .string()
    .min(1, 'Mongo Id required')
    .refine((val) => mongoose.isValidObjectId(val), { message: 'Invalid mongo id' }),
  z.instanceof(mongoose.Types.ObjectId),
]);

export const isNumberRequiredErrMsg = {
  invalid_type_error: 'required a number',
};

export const minMaxPriceSchema = z
  .object({
    min: z.coerce.number({ ...isNumberRequiredErrMsg }),
    max: z.coerce.number({ ...isNumberRequiredErrMsg }),
  })
  .refine(
    (val) => {
      // do not allow any negative value
      if (val.min < 0 || val.max < 0) {
        return false;
      }

      // allowing the same value because sometime user do not want to give two different price and that time the price can be both same
      if (val.min == val.max) {
        return true;
      }

      if (val.min > val.max) {
        return false;
      }

      return true;
    },
    { message: 'Min value for price can not be greater than max value' },
  );

export type TMinMaxPriceSchema = z.infer<typeof minMaxPriceSchema>;
export type ValidMongoIdSchema = z.infer<typeof validMongoIdSchema>;
