import { Response } from 'express';
import { envVariables } from './env';
import { API_DOMAIN } from '../constants';

export const removeCookie = (cookieName: string, res: Response) => {
  res.clearCookie(cookieName, {
    domain: envVariables.NODE_ENV === 'development' ? 'localhost' : API_DOMAIN,
    path: '/',
  });
};
