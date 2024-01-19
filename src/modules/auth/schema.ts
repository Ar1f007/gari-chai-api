import { z } from 'zod';

// Define a schema for the social provider within the user schema
const SocialProviderSchema = z.object({
  name: z.string(),
  id: z.string(),
  token: z.string(),
  email: z.string(),
  username: z.string(),
});

// Define the main user schema
const userSchema = z.object({
  // Basic information
  firstName: z.string(),
  lastName: z.string(),

  // Local authentication information
  local: z.object({
    email: z.object({
      type: z.string(),
      unique: z.boolean(),
      required: z.boolean(),
    }),
    phone: z.object({
      type: z.string(),
      unique: z.boolean(),
      required: z.boolean(),
    }),
    password: z.object({
      type: z.string(),
      required: z.boolean(),
    }),
  }),

  // Social authentication providers
  social: z.object({
    providers: z.array(SocialProviderSchema),
  }),

  // User roles
  role: z.array(z.enum(['user', 'admin', 'super-admin', 'moderator', 'editor', 'support'])),

  // Address information
  address: z.string(),

  // Account verification status
  isVerified: z.boolean(),
  verificationCode: z.string(),
  verificationCodeExpires: z.date(),

  // Password change and reset information
  passwordChangedAt: z.date(),
  passwordResetCode: z.string(),
  passwordResetExpires: z.date(),

  // Account activation status
  isAccountActive: z.boolean(),

  // User profile information
  profilePicture: z.string(),
  language: z.string(),

  // Notification preferences
  notificationPreferences: z.object({
    email: z.boolean(),
    inApp: z.boolean(),
    sms: z.boolean(),
  }),

  // Two-factor authentication details
  twoFactorAuth: z.object({
    enabled: z.boolean(),
    secret: z.string(),
    recoveryCodes: z.array(z.string()),
  }),

  // User's last login details
  lastLogin: z.object({
    timestamp: z.date(),
    ipAddress: z.string(),
  }),

  // User's activity log
  activityLog: z.array(
    z.object({
      timestamp: z.date(),
      action: z.string(),
      details: z.string(),
    }),
  ),

  // Reason for account deactivation
  accountDeactivationReason: z.string(),

  // Refresh token for authentication
  refreshToken: z.string().nullable(),

  // Metadata with size validation
  metaData: z.record(z.unknown()).default({}),
});

export default userSchema;

export type UserSchema = z.infer<typeof userSchema>;
