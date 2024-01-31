import { z } from 'zod';
import { phoneNumberSchema } from '../../utils/helperSchema';

/**
 * SIGNUP SCHEMA
 */

const isStrongPassword = (value: string): boolean => {
  // Strong password criteria: Minimum 8 characters, at least one lowercase letter, one uppercase letter, and one digit
  const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
  return regex.test(value);
};

export const signupUserBasicInfo = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

export const signupPasswordSchema = z.object({
  password: z.string().refine((value) => isStrongPassword(value), {
    message:
      'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit',
  }),
});

export const signupWithEmailRequiredInfo = z.object({
  email: z.string().min(1).email(),
});

export const signupWithPhoneRequiredInfo = z.object({
  phone: phoneNumberSchema,
});

export const signupWithEmailSchema = z.object({
  body: signupUserBasicInfo.merge(signupWithEmailRequiredInfo).merge(signupPasswordSchema),
});

export const signupWithPhoneSchema = z.object({
  body: signupUserBasicInfo.merge(signupWithPhoneRequiredInfo).merge(signupPasswordSchema),
});

/**
 * LOGIN SCHEMA
 */
export const loginWithEmailSchema = z.object({
  body: z.object({
    email: z.string().min(1).email(),
    password: z.string().min(1),
  }),
});

export const loginWithPhoneSchema = z.object({
  body: z.object({
    phone: phoneNumberSchema,
    password: z.string().min(1),
  }),
});

/**
 * OTP
 */
export const verifyOTPSchema = z.object({
  body: z.object({
    phoneNumber: phoneNumberSchema,
    otp: z.number().min(1, 'OTP is required'),
  }),
});

export const sendOTPSchema = z.object({
  body: z.object({
    phoneNumber: phoneNumberSchema,
  }),
});

export type SignupWithEmailSchema = z.infer<typeof signupWithEmailSchema>;
export type SignupWithPhoneSchema = z.infer<typeof signupWithPhoneSchema>;
export type VerifyOTPInputs = z.infer<typeof verifyOTPSchema>['body'];
export type SendOTPInputs = z.infer<typeof sendOTPSchema>['body'];
