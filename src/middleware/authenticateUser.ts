import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/appError';
import { isTokenValid } from '../lib/jwt/isTokenValid';
import { TReqUser } from '../types';
import { GARI_CHAI_TOKEN } from '../constants';

export interface AuthenticatedRequest extends Request {
  user?: TReqUser;
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies[GARI_CHAI_TOKEN];

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
