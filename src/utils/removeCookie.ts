import { Response } from 'express';

export const removeCookie = (cookieName: string, res: Response) => {
  const oneDay = 24 * 60 * 60 * 1000;

  res.clearCookie(cookieName, {
    path: '/',
    expires: new Date(Date.now() - oneDay),
  });
};
