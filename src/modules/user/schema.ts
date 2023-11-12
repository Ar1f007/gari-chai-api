import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

const payload = {
  body: z.object({
    name: z.string().min(3, 'Name should be at least 3 characters long'),
    phoneNumber: z
      .string()
      .refine((phoneNumber) => isValidPhoneNumber(phoneNumber, 'BD'), { message: 'Invalid phone number format' }),
    password: z.string().min(6, 'Password should be at least 6 characters long'),
    emails: z.array(z.string()).optional().default([]),
  }),
};

export const createUserSchema = z.object({
  ...payload,
});

export type CreateUserInputs = z.infer<typeof createUserSchema>['body'];
