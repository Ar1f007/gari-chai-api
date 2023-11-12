import jwt from 'jsonwebtoken';
import { envVariables } from '../../utils/env';

export const createToken = (payload: any) => {
  return jwt.sign(payload, envVariables.JWT_SECRET_KEY, {
    expiresIn: envVariables.JWT_LIFETIME,
  });
};
