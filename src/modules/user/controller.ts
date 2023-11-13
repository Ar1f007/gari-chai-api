import { Response, Request } from 'express';
import bcrypt from 'bcrypt';

import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';

import { createNewUser, findUser, deleteUser, findAndUpdateUser } from './service';
import AppError from '../../utils/appError';
import { CreateUserInputs, VerifyOTPInputs } from './schema';
import { sendOTP } from '../../utils/sendOTP';
import { attachCookiesToResponse } from '../../utils/attachCookiesToResponse';

export async function createNewUserHandler(req: Request<{}, {}, CreateUserInputs>, res: Response) {
  const { phoneNumber } = req.body;

  // check if user already exist with the same phone number
  const userExists = await findUser({ phoneNumber });

  if (userExists) {
    throw new AppError('A user with this phone number already exists, please login', StatusCodes.BAD_REQUEST);
  }

  const doc = await createNewUser(req.body);

  if (!doc) {
    throw new AppError('Could not create account, try again later', StatusCodes.BAD_REQUEST);
  }

  const code = await doc.generateAccountVerificationCode();

  await doc.save();

  try {
    await sendOTP(code);
  } catch (e) {
    deleteUser({ phoneNumber });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Something went wrong, please try again',
      data: {
        isOTPSentSuccessful: false,
      },
    });
  }

  const userDoc = doc.toJSON();

  attachCookiesToResponse(res, {
    id: doc._id,
    name: doc.name,
    phoneNumber: doc.phoneNumber,
    role: doc.role,
  });

  const sanitizedUserDoc = omit(userDoc, ['password', 'verificationCode', 'verificationCodeExpires']);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: sanitizedUserDoc,
    message: 'Please provide the OTP we sent to your phone',
    isOTPSentSuccessful: true,
  });
}

export async function verifyOTPHandler(req: Request<{}, {}, VerifyOTPInputs>, res: Response) {
  const { otp, phoneNumber } = req.body;

  const user = await findUser({ phoneNumber });

  if (!user) {
    throw new AppError('No user was found', StatusCodes.BAD_REQUEST);
  }

  if (!user.verificationCode || (user.verificationCodeExpires && new Date() > user.verificationCodeExpires)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: 'fail',
      message: 'Your verification code is invalid or has expired, please try again',
      OTPExpiredOrNotFound: true,
    });
  }

  const isValidOTP = await bcrypt.compare(otp.toString(), user.verificationCode);

  if (isValidOTP) {
    findAndUpdateUser(
      {
        _id: user._id,
      },
      {
        isVerified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
      {
        new: true,
      },
    );

    const sanitizedUserDoc = omit(user, ['password', 'verificationCode', 'verificationCodeExpires']);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Account is verified',
      data: sanitizedUserDoc,
    });
  }

  res.status(StatusCodes.BAD_REQUEST).json({
    status: 'error',
    message: 'Invalid code',
  });
}
