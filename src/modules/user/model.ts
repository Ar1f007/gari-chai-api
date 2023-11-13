import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

import { CreateUserInputs } from './schema';

export interface UserDocument extends CreateUserInputs, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;

  role: string[];
  image: string;

  verificationCode: string | undefined;
  verificationCodeExpires: Date | undefined;

  passwordChangedAt: Date;
  passwordResetCode: string;
  passwordResetExpires: Date | undefined;

  isVerified: boolean;
  isAccountActive: boolean;

  generateAccountVerificationCode(): Promise<number>;
  createPasswordResetCode(): Promise<string>;
  // eslint-disable-next-line no-unused-vars
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const SALT_ROUNDS = 10;
const TEN_MINUTES_IN_MS = 10 * 60 * 1000;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },

    emails: {
      type: [String],
      required: false,
      default: [],
    },

    image: {
      type: String,
      required: false,
    },

    role: {
      type: [String],
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
  },
  {
    timestamps: true,
  },
);
// Hash user password
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
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

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 min

  return code;
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
