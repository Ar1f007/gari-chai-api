/* eslint-disable no-unused-vars */
import { TReqUser } from '../../src/types';

declare global {
  namespace Express {
    interface Request {
      user?: TReqUser;
    }
  }
}
