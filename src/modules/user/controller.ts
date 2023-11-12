import { Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { omit } from 'lodash';

import { createNewUser, findUser, removeUser } from './service';
import AppError from '../../utils/appError';
import { CreateUserInputs } from './schema';
import { sendOTP } from '../../utils/sendOTP';

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
    removeUser({ phoneNumber });

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Something went wrong, please try again',
      data: {
        isOTPSentSuccessful: false,
      },
    });
  }

  const userDoc = doc.toObject();

  const sanitizedUserDoc = omit(userDoc, ['password', 'verificationCode', 'verificationCodeExpires']);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: sanitizedUserDoc,
    message: 'Please provide the OTP we sent to your phone',
    isOTPSentSuccessful: true,
  });
}
