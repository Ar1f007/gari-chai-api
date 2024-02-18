import mongoose from 'mongoose';
import { z } from 'zod';

export const validMongoIdSchema = z.union([
  z.string().refine((val) => mongoose.isValidObjectId(val), { message: 'Invalid mongo id' }),
  z.instanceof(mongoose.Types.ObjectId),
]);

export type ValidMongoIdSchema = z.infer<typeof validMongoIdSchema>;
