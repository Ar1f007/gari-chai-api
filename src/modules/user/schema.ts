import { z } from 'zod';
import { phoneNumberSchema } from '../../utils/helperSchema';

const payload = {
  body: z.object({
    name: z.string().min(3, 'Name should be at least 3 characters long'),
    phoneNumber: phoneNumberSchema,
    password: z.string().min(6, 'Password should be at least 6 characters long'),
    emails: z.array(z.string()).optional().default([]),
  }),
};

export const createUserSchema = z.object({
  ...payload,
});

export const verifyOTPSchema = z.object({
  body: z.object({
    phoneNumber: phoneNumberSchema,
    otp: z.number().min(1, 'OTP is required'),
  }),
});

export type CreateUserInputs = z.infer<typeof createUserSchema>['body'];
export type VerifyOTPInputs = z.infer<typeof verifyOTPSchema>['body'];
