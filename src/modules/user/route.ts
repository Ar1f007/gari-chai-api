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

userRouter.post('/signup/email', validateResource(signupWithEmailSchema), signupWithEmailHandler);

userRouter.post('/login/email', validateResource(loginWithEmailSchema), loginWithEmail);

userRouter.post('/signup/phone', validateResource(signupWithPhoneSchema), signupWithPhoneHandler);

userRouter.post('/login/phone', validateResource(loginWithPhoneSchema), loginWithPhoneHandler);

userRouter.get('/profile', authenticated, getProfile);

userRouter.post('/logout', logoutUserHandler);

export default userRouter;
