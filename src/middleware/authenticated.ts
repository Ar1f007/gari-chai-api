import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import passport from 'passport';
import { UserDocument } from '../modules/user/model';

export const authenticated = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (error: any, user: UserDocument) => {
    if (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: 'fail', message: 'Authentication failed' });
    }

    if (!user) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ status: 'fail', message: 'Your session has expired or is invalid. Please log in again.' });
    }

    req.user = user;

    next();
  })(req, res, next);
};
