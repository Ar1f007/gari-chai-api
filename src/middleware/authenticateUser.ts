import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';
import { isTokenValid } from '../lib/jwt/isTokenValid';
import { TReqUser } from '../types';
import { AUTH_TOKEN_NAME } from '../constants';

export interface AuthenticatedRequest extends Request {
  user?: TReqUser;
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies[AUTH_TOKEN_NAME];

  if (!token) {
    throw new AppError('Authentication invalid', StatusCodes.UNAUTHORIZED);
  }

  try {
    const data = isTokenValid(token);
    req.user = data as TReqUser;

    next();
  } catch (error) {
    throw new AppError('Authentication invalid', StatusCodes.FORBIDDEN);
  }
};
