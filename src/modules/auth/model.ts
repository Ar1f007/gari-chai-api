import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserSchema } from './schema';

const SALT_ROUNDS = 10;
const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

export interface UserDocument extends UserSchema, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;

  generateAccountVerificationCode(): Promise<number>;
  createPasswordResetCode(): Promise<string>;
  // eslint-disable-next-line no-unused-vars
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    local: {
      email: {
        type: String,
        unique: true,
        required: false,
      },
      phone: {
        type: String,
        unique: true,
        required: false,
      },
      password: {
        type: String,
        required: false,
      },
    },
    social: {
      providers: [
        {
          name: String,
          id: String,
          token: String,
          email: String,
          username: String,
        },
      ],
    },

    role: {
      type: [String],
      enum: ['user', 'admin', 'super-admin', 'moderator', 'editor', 'support'],
      default: ['user'],
    },
    address: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },

    verificationCodeExpires: {
      type: Date,
    },

    passwordChangedAt: { type: Date },
    passwordResetCode: { type: String },
    passwordResetExpires: { type: Date },

    isAccountActive: {
      type: Boolean,
      default: true,
    },

    profilePicture: String,
    language: String,
    notificationPreferences: {
      email: Boolean,
      inApp: Boolean,
      sms: Boolean,
    },
    twoFactorAuth: {
      enabled: Boolean,
      secret: String,
      recoveryCodes: [String],
    },
    lastLogin: {
      timestamp: Date,
      ipAddress: String,
    },
    activityLog: [
      {
        timestamp: Date,
        action: String,
        details: String,
      },
    ],
    accountDeactivationReason: String,

    refreshToken: {
      type: String,
      default: null,
    },

    metaData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (v: Record<string, any>) {
          const sizeInBytes = Buffer.from(JSON.stringify(v)).length;
          return sizeInBytes <= 8192; // 8 KB limit
        },
        message: 'Metadata size exceeds the maximum limit of 8 KB.',
      },
    },
  },
  {
    timestamps: true,
  },
);

// Hash user password
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified

  if (!this.isModified('local.password')) return next();
  if (!this.local || !this.local.password) return next();

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.local.password = await bcrypt.hash(this.local.password, salt);

  // set default image using name if one is not provided
  const username = this?.firstName + ' ' + this?.lastName;
  const name = username.length > 1 ? username : 'user';

  if (!this.profilePicture) {
    this.profilePicture = `https://eu.ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=150`;
  }

  next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.local.password);
};

userSchema.methods.generateAccountVerificationCode = async function () {
  // const code = Math.floor(1000 + crypto.randomInt(9999));
  const code = 1234;

  const salt = await bcrypt.genSalt(SALT_ROUNDS);

  this.verificationCode = await bcrypt.hash(code.toString(), salt);

  this.verificationCodeExpires = Date.now() + TEN_MINUTES_IN_MS; // 10 min

  return code;
};

userSchema.methods.createPasswordResetCode = async function () {
  const code = crypto.randomBytes(3).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(code).digest('hex');

  this.passwordResetExpires = Date.now() + TEN_MINUTES_IN_MS; // 10 min

  return code;
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
