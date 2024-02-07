import express from 'express';
import {
  deactivateUserHandler,
  deleteUserHandler,
  getProfile,
  loginWithEmail,
  loginWithPhoneHandler,
  logoutUserHandler,
  signupWithEmailHandler,
  signupWithPhoneHandler,
  updateBasicInfoHandler,
  updatePasswordHandler,
} from './controller';
import '../../config/passport';
import { authenticated, validateResource } from '../../middleware';
import {
  changePasswordSchema,
  loginWithEmailSchema,
  loginWithPhoneSchema,
  signupWithEmailSchema,
  signupWithPhoneSchema,
  updateUserBasicInfoSchema,
} from './schema';

const userRouter = express.Router();

userRouter.post('/signup/email', validateResource(signupWithEmailSchema), signupWithEmailHandler);

userRouter.post('/login/email', validateResource(loginWithEmailSchema), loginWithEmail);

userRouter.post('/signup/phone', validateResource(signupWithPhoneSchema), signupWithPhoneHandler);

userRouter.post('/login/phone', validateResource(loginWithPhoneSchema), loginWithPhoneHandler);

userRouter.get('/profile', authenticated, getProfile);

userRouter.post('/logout', logoutUserHandler);

userRouter.put(
  '/update-basic-info',
  validateResource(updateUserBasicInfoSchema),
  authenticated,
  updateBasicInfoHandler,
);

userRouter.patch('/update-password', validateResource(changePasswordSchema), authenticated, updatePasswordHandler);

userRouter.delete('/', authenticated, deleteUserHandler);
userRouter.patch('/deactivate-account', authenticated, deactivateUserHandler);

export default userRouter;
