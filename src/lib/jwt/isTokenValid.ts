import jwt from 'jsonwebtoken';
import { envVariables } from '../../utils/env';

export const isTokenValid = (token: string) => jwt.verify(token, envVariables.JWT_SECRET_KEY);
