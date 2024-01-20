import express from 'express';
import {
  getProfile,
  loginWithEmail,
  loginWithPhoneHandler,
  logoutUserHandler,
  signupWithEmailHandler,
  signupWithPhoneHandler,
} from './controller';
import '../../config/passport';
import { authenticated, validateResource } from '../../middleware';
import { loginWithEmailSchema, loginWithPhoneSchema, signupWithEmailSchema, signupWithPhoneSchema } from './schema';

const userRouter = express.Router();

userRouter.post('/email-signup', validateResource(signupWithEmailSchema), signupWithEmailHandler);

userRouter.post('/email-login', validateResource(loginWithEmailSchema), loginWithEmail);

userRouter.post('/phone-signup', validateResource(signupWithPhoneSchema), signupWithPhoneHandler);

userRouter.post('/phone-login', validateResource(loginWithPhoneSchema), loginWithPhoneHandler);

userRouter.get('/profile', authenticated, getProfile);

userRouter.post('/logout', logoutUserHandler);

export default userRouter;
