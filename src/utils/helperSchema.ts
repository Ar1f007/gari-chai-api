import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export function xCharacterLong(fieldName: string, length: number) {
  return `${fieldName} should be at least ${length} character long`;
}

export const imageSchema = z.object({
  thumbnailUrl: z.string().url().optional(),
  originalUrl: z.string().url(),
});

export const phoneNumberSchema = z
  .string()
  .refine((phoneNumber) => isValidPhoneNumber(phoneNumber, 'BD'), { message: 'Invalid phone number format' });

export const numberOrNull = z.union([z.number(), z.null()]);

export const singleSpecificationSchema = z.object({
  name: z.string().min(1, 'name is required'),
  value: z.union([z.string().min(1, 'value is required'), z.boolean()]),
  valueType: z.enum(['boolean', 'text']),
});
