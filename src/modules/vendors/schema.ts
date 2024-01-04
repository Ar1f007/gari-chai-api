import { z } from 'zod';
import { imageSchema, phoneNumberSchema, xCharacterLong } from '../../utils/helperSchema';

export const addVendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required').min(3, xCharacterLong('Vendor name', 3)),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine(
      (val) => {
        const parsedPhoneNum = phoneNumberSchema.safeParse(val);
        return parsedPhoneNum.success;
      },
      { message: 'Invalid phone number' },
    ),

  email: z.optional(
    z.string().refine((val) => {
      if (val) {
        const emailSchema = z.string().email();
        return emailSchema.parse(val);
      }
      return true;
    }, 'Invalid Email'),
  ),

  address: z.optional(z.string()),

  image: imageSchema.optional(),
});

export type AddVendorSchema = z.infer<typeof addVendorSchema>;
