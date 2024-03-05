import { z } from 'zod';
import { phoneNumberSchema, sortSchema } from '../../utils/helperSchema';

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

export const updateUserBasicInfoSchema = z.object({
  body: signupUserBasicInfo.merge(
    z.object({
      additionalInfo: z.object({
        phone: z.optional(
          z.string().refine(
            (val) => {
              if (val.length > 0) {
                return phoneNumberSchema.safeParse(val).success;
              }

              return true;
            },
            { message: 'Please enter a valid Bangladeshi phone number' },
          ),
        ),
        email: z.string().refine(
          (val) => {
            if (val.length > 0) {
              return z.string().email().safeParse(val).success;
            } else {
              return true;
            }
          },
          {
            message: 'Please enter a valid email address',
          },
        ),
      }),
      address: z.string().optional(),
    }),
  ),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: signupPasswordSchema.shape.password,
  }),
});

const query = {
  query: z
    .object({
      page: z.string().refine((val) => !isNaN(Number(val)), { message: 'Page value should be of type number' }),
      limit: z.string().refine((val) => !isNaN(Number(val)), { message: 'Page limit should be of type number' }),
      firstName: z.string(),
      lastName: z.string(),
      createdAt: z.string(),
      isBanned: z.string(),
      isAccountActive: z.string(),
      sort: sortSchema,
    })
    .partial(),
};

export const getUsersQuerySchema = z.object({
  ...query,
});

export const resetPasswordRequestSchema = z.object({
  body: z.object({
    sendCodeTo: z.string(),
    requestedFrom: z.string(),
    type: z.enum(['email', 'phone']),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    code: z.string(),
    password: z.string(),
  }),
});

export type SignupWithEmailSchema = z.infer<typeof signupWithEmailSchema>;
export type SignupWithPhoneSchema = z.infer<typeof signupWithPhoneSchema>;
export type VerifyOTPInputs = z.infer<typeof verifyOTPSchema>['body'];
export type SendOTPInputs = z.infer<typeof sendOTPSchema>['body'];
export type UpdateBasicInfo = z.infer<typeof updateUserBasicInfoSchema>;
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export type GetUsersQueryParams = z.infer<typeof getUsersQuerySchema>;
export type ResetPasswordRequestPayload = z.infer<typeof resetPasswordRequestSchema>;
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
