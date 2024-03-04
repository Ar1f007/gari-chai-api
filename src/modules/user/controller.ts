import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';
import { omit } from 'lodash';

import User, { UserDocument } from './model';
import CommentModel from '../comment/model';
import ReviewModel from '../review/model';

// Utilities
import { attachCookiesToResponse } from '../../utils/attachCookiesToResponse';
import { removeCookie } from '../../utils/removeCookie';
import { countUsers, findAndUpdateUser, findUser, findUsers } from './services';
import AppError from '../../utils/appError';
import { sendOTP } from '../../utils/sendOTP';

// Constants
import { LOCAL_EMAIL_FIELD, LOCAL_PHONE_FIELD, SORT_FIELD_SEPARATOR } from '../../constants';

// Schemas
import { ChangePasswordSchema, GetUsersQueryParams, SendOTPInputs, UpdateBasicInfo, VerifyOTPInputs } from './schema';

async function checkAndUpdateBanStatus(user: UserDocument) {
  if (user.isBanned && user.banExpiry && user.banExpiry <= new Date()) {
    // If the user is banned and the ban has expired, lift the ban
    await User.findByIdAndUpdate(user._id, {
      $set: {
        isBanned: false,
        banReason: null,
        banExpiry: null,
        banNotes: null,
      },
    });
  }
}

async function activateAccount(user: UserDocument) {
  if (!user.isAccountActive) {
    await User.findByIdAndUpdate(user._id, {
      $set: {
        isAccountActive: true,
      },
    });
  }
}

function sanitizeUser(user: UserDocument): Record<string, any> {
  return omit(user.toJSON(), [
    'local.password',
    'verificationCode',
    'verificationCodeExpires',
    'twoFactorAuth',
    'activityLog',
  ]);
}

function buildSearchFilters(query: GetUsersQueryParams['query']): Record<string, any> {
  const filters: Record<string, any> = {};

  if (query.firstName) {
    filters['firstName'] = { $regex: new RegExp(query.firstName, 'i') };
  }

  if (query.lastName) {
    filters['lastName'] = { $regex: new RegExp(query.lastName, 'i') };
  }

  return filters;
}

function formatSortField(str: string): string {
  const [column, order] = str.split(SORT_FIELD_SEPARATOR);

  return order === 'asc' ? column : `-${column}`;
}

function getSortFields(sortQuery: GetUsersQueryParams['query']['sort']): string {
  let defaultSortStr = '-launchedAt'; // by default latest "launched at" first

  if (!sortQuery) return defaultSortStr;

  if (typeof sortQuery === 'string') {
    const formattedStr = formatSortField(sortQuery);

    return formattedStr;
  }

  if (Array.isArray(sortQuery)) {
    const options: string[] = [];

    for (let i = 0; i < sortQuery.length; i++) {
      const formattedStr = formatSortField(sortQuery[i]);

      options.push(formattedStr);
    }

    return options.join(' ');
  }

  return defaultSortStr;
}

/**
 * Handles the signup process for a user.
 * Creates a new user object with the provided credentials and saves it to the database.
 * If a user with the same identifier (email or phone) already exists, it returns an error response.
 * After successfully saving the user, it attaches authentication cookies to the response and returns a success response with the sanitized user data.
 *
 * @param req - The request object containing the user's signup data.
 * @param res - The response object to send the signup result.
 * @param criteria - The criteria to search for an existing user (e.g., 'local.email' or 'local.phone').
 * @param identifier - The identifier field (e.g., 'email' or 'phone').
 * @returns A promise that resolves to the signup result.
 */
async function handleSignup(req: Request, res: Response, criteria: string, identifier: 'phone' | 'email') {
  let newUser = new User({
    local: {
      [identifier]: req.body[identifier],
      password: req.body.password,
    },
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  const existingUser = await User.findOne({ [criteria]: req.body[identifier] });

  if (existingUser) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: `This ${
        identifier.charAt(0).toUpperCase() + identifier.slice(1)
      } ${identifier == 'phone' ? 'number' : ''} is already registered with us. Please login to continue`,
    });
  }

  const user = await newUser.save();

  attachCookiesToResponse(res, {
    data: {
      id: user._id,
      [identifier]: (user.local! as { [key: string]: string })[identifier],
      name: user.firstName + ' ' + user.lastName,
      role: user.role,
    },
  });

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: sanitizeUser(user),
    message: '',
  });
}

/**
 * Handles user login requests.
 * @param req - The request object containing the user login information.
 * @param res - The response object used to send the authentication result and cookies.
 * @param next - The next function to be called in the middleware chain.
 * @param strategy - The authentication strategy to be used (e.g., 'local.email', 'local.phone').
 * @param identifier - The identifier used to authenticate the user (e.g., 'email', 'phone').
 */
async function handleLogin(req: Request, res: Response, next: NextFunction, strategy: string, identifier: string) {
  passport.authenticate(strategy, { session: false }, async (err: any, user: UserDocument, info: any) => {
    if (err || !user) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: 'fail',
        message: info?.message || 'Authentication failed',
      });
    }

    await checkAndUpdateBanStatus(user);

    await activateAccount(user);

    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          status: 'fail',
          message: 'Invalid credentials',
        });
      }

      attachCookiesToResponse(res, {
        data: {
          id: user._id,
          [identifier]: (user.local! as { [key: string]: string })[identifier],
          name: user.firstName + ' ' + user.lastName,
          role: user.role,
        },
      });

      res.status(StatusCodes.OK).json({
        status: 'success',
        data: sanitizeUser(user),
      });
    });
  })(req, res, next);
}
export async function signupWithEmailHandler(req: Request, res: Response) {
  await handleSignup(req, res, LOCAL_EMAIL_FIELD, 'email');
}

export async function loginWithEmail(req: Request, res: Response, next: NextFunction) {
  await handleLogin(req, res, next, LOCAL_EMAIL_FIELD, 'email');
}

export async function signupWithPhoneHandler(req: Request, res: Response) {
  await handleSignup(req, res, LOCAL_PHONE_FIELD, 'phone');
}

export async function loginWithPhoneHandler(req: Request, res: Response, next: NextFunction) {
  await handleLogin(req, res, next, LOCAL_PHONE_FIELD, 'phone');
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

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: sanitizeUser(user),
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

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'Account is verified',
      data: sanitizeUser(user),
    });
  }

  res.status(StatusCodes.BAD_REQUEST).json({
    status: 'error',
    message: 'Invalid code',
  });
}

export async function updateBasicInfoHandler(req: Request<{}, {}, UpdateBasicInfo['body']>, res: Response) {
  const {
    firstName,
    lastName,
    additionalInfo: { email, phone },
    address,
  } = req.body;

  const userId = (req.user as UserDocument).id;

  const user = await findAndUpdateUser(
    {
      _id: userId,
    },
    {
      firstName,
      lastName,
      address,
      additionalInfo: {
        email,
        phone,
      },
    },
    {
      new: true,
    },
  );

  return res.status(StatusCodes.OK).json({
    status: user ? 'success' : 'fail',
    data: user ? sanitizeUser(user) : null,
    message: user ? 'Updated successfully' : 'Something went wrong, Could not update the info',
  });
}

export async function updatePasswordHandler(req: Request<{}, {}, ChangePasswordSchema['body']>, res: Response) {
  const { newPassword, oldPassword } = req.body;
  const userId = (req.user as UserDocument).id;

  const user = await findUser(
    {
      _id: userId,
    },
    {
      lean: false,
    },
  );

  if (!user) throw new AppError('No user found', StatusCodes.BAD_REQUEST);

  const isOldPasswordValid = await user.isValidPassword(oldPassword);

  if (!isOldPasswordValid) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      status: 'fail',
      message: 'Incorrect old password',
    });
  }

  user.local!.password = newPassword;
  user.passwordChangedAt = new Date();

  await user.save();

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Password changed successfully',
    data: sanitizeUser(user),
  });
}

/**
 * Handles the deletion of a user account.
 * Removes the user from the database permanently.
 * Requires authentication to ensure the user has the privilege to delete their account.
 *
 * @param req - The request object containing user authentication and deletion data.
 * @param res - The response object used to send the deletion result.
 * @returns A promise that resolves to the deletion result.
 */
export async function deleteUserHandler(req: Request, res: Response) {
  const userId = (req.user as UserDocument).id;

  try {
    const deleteUserPromise = User.findByIdAndDelete(userId);
    // TODO: REMOVE USER ID FROM CHILD COMMENTS ARRAY
    const deleteCommentsPromise = CommentModel.deleteMany({ user: userId });
    const deleteReviewsPromise = ReviewModel.deleteMany({ userId: userId });

    await Promise.all([deleteUserPromise, deleteCommentsPromise, deleteReviewsPromise]);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Something went wrong while trying to delete your account.',
    });
  }
}

/**
 * Handles the deactivation of a user account.
 * Marks the user's account as inactive without deleting it.
 * Requires authentication to ensure the user has the privilege to deactivate their account.
 *
 * @param req - The request object containing user authentication and deactivation data.
 * @param res - The response object used to send the deactivation result.
 * @returns A promise that resolves to the deactivation result.
 */
export async function deactivateUserHandler(req: Request, res: Response) {
  const userId = (req.user as UserDocument).id;

  await findAndUpdateUser(
    {
      _id: userId,
    },
    {
      isAccountActive: false,
    },
  );

  return res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Account deactivated successfully',
  });
}

export async function getUsersHandler(req: Request<{}, {}, {}, GetUsersQueryParams['query']>, res: Response) {
  // Default values for pagination
  const DEFAULT_PAGE_NUMBER = 1;
  const DEFAULT_ITEMS_PER_PAGE = 10;

  // Maximum allowed values for pagination
  const MAX_ALLOWED_ITEMS = 1000; // Maximum documents allowed to be returned
  const MAX_SAFE_ITEMS_LIMIT = 500; // Maximum items to return if requested exceeds the limit

  // Extract and process query filters
  const queryFilters = buildSearchFilters(req.query);

  // Parse and validate the current page number
  const currentPage = (req.query.page && !isNaN(Number(req.query.page)) && +req.query.page) || DEFAULT_PAGE_NUMBER;

  // Parse and validate items per page, considering maximum allowed items
  const requestedItemsPerPage =
    req.query.limit && !isNaN(Number(req.query.limit)) ? +req.query.limit : DEFAULT_ITEMS_PER_PAGE;
  const itemsPerPage = Math.min(requestedItemsPerPage, MAX_ALLOWED_ITEMS, MAX_SAFE_ITEMS_LIMIT);

  // Extract and validate sort fields
  const sortFields = getSortFields(req.query.sort);

  // Retrieve total car count and paginated car data
  const [totalUsersCount, foundUsers] = await Promise.all([
    countUsers(queryFilters),
    findUsers(queryFilters, { skip: (currentPage - 1) * itemsPerPage, limit: itemsPerPage }, sortFields),
  ]);

  // Calculate total pages
  const totalPages = Math.ceil(totalUsersCount / itemsPerPage);

  // Determine if there is a next page
  const hasNextPage = currentPage < totalPages;
  const nextPage = hasNextPage ? currentPage + 1 : null;

  // Send the response
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      results: foundUsers,
      pagination: {
        totalItems: totalUsersCount,
        totalPages,
        currentPage,
        nextPage,
        hasNextPage,
      },
    },
  });
}
