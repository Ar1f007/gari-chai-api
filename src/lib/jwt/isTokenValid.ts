import jwt from 'jsonwebtoken';
import { envVariables } from '../../utils/env';
import { TReqUser } from '../../types';

export const isTokenValid = (token: string) => jwt.verify(token, envVariables.JWT_SECRET_KEY) as TReqUser;
