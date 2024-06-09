import { Response } from 'express';
import { envVariables } from './env';

import { createToken } from '../lib/jwt/create-token';
import { AUTH_TOKEN_NAME } from '../constants';

const SEVEN_DAYS = 1000 * 60 * 60 * 24 * 7; // same as JWT_LIFETIME

export const attachCookiesToResponse = (res: Response, user: any) => {
  const token = createToken(user);

  res.cookie(AUTH_TOKEN_NAME, token, {
    httpOnly: true,
    expires: new Date(Date.now() + SEVEN_DAYS),
    secure: envVariables.NODE_ENV === 'production',
    sameSite: envVariables.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return token;
};
