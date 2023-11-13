import { Response, Request } from 'express';
import bcrypt from 'bcrypt';

import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';

import { createNewUser, findUser, deleteUser, findAndUpdateUser } from './service';
import AppError from '../../utils/appError';
import { CreateUserInputs, LoginUserInputs, SendOTPInputs, VerifyOTPInputs } from './schema';
import { sendOTP } from '../../utils/sendOTP';
import { attachCookiesToResponse } from '../../utils/attachCookiesToResponse';
import { AuthenticatedRequest } from '../../middleware/authenticateUser';

export async function createNewUserHandler(req: Request<{}, {}, CreateUserInputs>, res: Response) {
  const { phoneNumber } = req.body;

  // check if user already exist with the same phone number
  const userExists = await findUser({ phoneNumber });

  if (userExists) {
    throw new AppError(
      'A user with this phone number already exists, please login to continue',
      StatusCodes.BAD_REQUEST,
    );
  }

  const doc = await createNewUser(req.body);

  if (!doc) {
    throw new AppError('Could not create account, try again later', StatusCodes.BAD_REQUEST);
  }

  const code = await doc.generateAccountVerificationCode();

  await doc.save();

  try {
    await sendOTP({
      phoneNumber: doc.phoneNumber,
      code,
    });
  } catch (e) {
    deleteUser({ phoneNumber });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Something went wrong, please try again',
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
  });
}

export async function loginUserHandler(req: Request<{}, {}, LoginUserInputs>, res: Response) {
  const { phoneNumber, password } = req.body;

  console.log(req.body.password, req.body.phoneNumber);

  const user = await findUser({ phoneNumber }, { lean: false });

  console.log(user);

  if (!user) {
    throw new AppError('Invalid credentials', StatusCodes.BAD_REQUEST);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', StatusCodes.BAD_REQUEST);
  }

  if (!user.isAccountActive) {
    user.isAccountActive = true;
    user.save();
  }

  const userDoc = user.toJSON();

  attachCookiesToResponse(res, {
    id: user._id,
    name: user.name,
    phoneNumber: user.phoneNumber,
    role: user.role,
  });

  const sanitizedUserDoc = omit(userDoc, ['password', 'verificationCode', 'verificationCodeExpires']);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: sanitizedUserDoc,
  });
}

export async function getMeHandler(req: AuthenticatedRequest, res: Response) {
  const user = await findUser({ _id: req.user?.id });

  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'success',
      data: null,
    });
  }

  const userData = {
    _id: user._id,
    name: user.name,
    image: user.image,
    phoneNumber: user.phoneNumber,
    emails: user.emails,
    role: user.role,
    isVerified: user.isVerified,
    isAccountActive: user.isAccountActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: userData,
  });
}

export async function sendOTPHandler(req: Request<{}, {}, SendOTPInputs>, res: Response) {
  const phoneNumber = req.body.phoneNumber;

  const user = await findUser({ phoneNumber }, { lean: false });

  if (!user) {
    throw new AppError('No user was found with this phone number', StatusCodes.BAD_REQUEST);
  }

  const code = await user.generateAccountVerificationCode();
  await user.save();

  try {
    sendOTP({ phoneNumber, code });

    res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'OTP Sent Successfully',
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong, Could not send OTP',
    });
  }
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
