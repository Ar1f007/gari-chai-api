import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const imageSchema = z.object({
  thumbnailUrl: z.string().optional(),
  originalUrl: z.string().optional(),
});

export const phoneNumberSchema = z
  .string()
  .refine((phoneNumber) => isValidPhoneNumber(phoneNumber, 'BD'), { message: 'Invalid phone number format' });

export const numberOrNull = z.union([z.number(), z.null()]);
