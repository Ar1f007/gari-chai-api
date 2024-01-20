import User, { UserDocument } from './model';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { attachCookiesToResponse } from '../../utils/attachCookiesToResponse';
import { omit } from 'lodash';
import { removeCookie } from '../../utils/removeCookie';
import { findAndUpdateUser, findUser } from './services';
import AppError from '../../utils/appError';
import bcrypt from 'bcrypt';
import { SendOTPInputs, VerifyOTPInputs } from './schema';
import { sendOTP } from '../../utils/sendOTP';

export async function signupWithEmailHandler(req: Request, res: Response) {
  let newUser = new User({
    local: {
      email: req.body.email,
      password: req.body.password,
    },
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const existingUser = await User.findOne({ 'local.email': req.body.email });

  if (existingUser) {
    return res.status(422).json({
      status: 'fail',
      message: 'Email has already been registered with us',
    });
  }

  const user = await newUser.save();

  attachCookiesToResponse(res, {
    data: {
      id: user._id,
      email: user.local!.email,
      name: user.firstName + ' ' + user.lastName,
      role: user.role,
    },
  });

  const sanitizedUserDoc = omit(user.toJSON(), [
    'local.password',
    'verificationCode',
    'verificationCodeExpires',
    'twoFactorAuth',
    'activityLog',
  ]);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: sanitizedUserDoc,
    message: '',
  });
}

export async function loginWithEmail(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('local.email', { session: false }, (err: any, user: UserDocument, info: any) => {
    if (err || !user) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: 'fail',
        message: info?.message || 'Authentication failed',
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        console.log('LOGIN ERROR ', err);
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          status: 'fail',
          message: 'Invalid credentials',
        });
      }

      attachCookiesToResponse(res, {
        data: {
          id: user._id,
          email: user.local!.email,
          name: user.firstName + ' ' + user.lastName,
          role: user.role,
        },
      });

      const sanitizedUserDoc = omit(user.toJSON(), [
        'local.password',
        'verificationCode',
        'verificationCodeExpires',
        'twoFactorAuth',
        'activityLog',
      ]);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: sanitizedUserDoc,
      });
    });
  })(req, res, next);
}

export async function signupWithPhoneHandler(req: Request, res: Response) {
  let newUser = new User({
    local: {
      phone: req.body.phone,
      password: req.body.password,
    },
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const existingUser = await User.findOne({ 'local.phone': req.body.phone });

  if (existingUser) {
    return res.status(422).json({
      status: 'fail',
      message: 'Phone number is already registered with us. Please login to continue',
    });
  }

  const user = await newUser.save();

  attachCookiesToResponse(res, {
    data: {
      id: user._id,
      email: user.local!.email,
      name: user.firstName + ' ' + user.lastName,
      role: user.role,
    },
  });

  const sanitizedUserDoc = omit(user.toJSON(), [
    'local.password',
    'verificationCode',
    'verificationCodeExpires',
    'twoFactorAuth',
    'activityLog',
  ]);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: sanitizedUserDoc,
    message: '',
  });
}

export async function loginWithPhoneHandler(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('local.phone', { session: false }, (err: any, user: UserDocument, info: any) => {
    if (err || !user) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: 'fail',
        message: info?.message || 'Authentication failed',
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) {
        console.log('LOGIN ERROR ', err);
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          status: 'fail',
          message: 'Invalid credentials',
        });
      }

      attachCookiesToResponse(res, {
        data: {
          id: user._id,
          email: user.local!.email,
          name: user.firstName + ' ' + user.lastName,
          role: user.role,
        },
      });

      const sanitizedUserDoc = omit(user.toJSON(), [
        'local.password',
        'verificationCode',
        'verificationCodeExpires',
        'twoFactorAuth',
        'activityLog',
      ]);

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: sanitizedUserDoc,
      });
    });
  })(req, res, next);
}

export async function logoutUserHandler(req: Request, res: Response) {
  const { cookieName } = req.body;

  removeCookie(cookieName, res);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Logout successful',
  });
}

export async function getProfile(req: Request, res: Response) {
  const user = req.user as UserDocument;

  const sanitizedUser = omit(user.toJSON(), [
    'local.password',
    'verificationCode',
    'verificationCodeExpires',
    'twoFactorAuth',
  ]);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: sanitizedUser,
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
