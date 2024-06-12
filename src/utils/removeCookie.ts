import { Response } from 'express';
import { envVariables } from './env';

export const removeCookie = (cookieName: string, res: Response) => {
  const oneDay = 24 * 60 * 60 * 1000;

  res.cookie(cookieName, {
    path: '/',
    expires: new Date(Date.now() - oneDay),
    httpOnly: true,
    secure: envVariables.NODE_ENV === 'production',
    sameSite: envVariables.NODE_ENV === 'production' ? 'none' : 'lax',
  });
};
