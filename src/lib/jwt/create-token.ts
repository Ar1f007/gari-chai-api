import jwt, { JwtPayload } from 'jsonwebtoken';
import { envVariables } from '../../utils/env';

// interface JwtPayload {
//   id: string;
// }

export const createToken = <T extends JwtPayload>(payload: T): string => {
  return jwt.sign(payload, envVariables.JWT_SECRET_KEY, {
    expiresIn: envVariables.JWT_LIFETIME,
  });
};
