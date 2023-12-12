import { Response } from 'express';

export const removeCookie = (cookieName: string, res: Response) => {
  res.clearCookie(cookieName);
};
