import express from 'express';
import {
  createPasswordResetCodeHandler,
  deactivateUserHandler,
  deleteUserHandler,
  getProfile,
  getUsersHandler,
  loginWithEmail,
  loginWithPhoneHandler,
  logoutUserHandler,
  resetPasswordHandler,
  signupWithEmailHandler,
  signupWithPhoneHandler,
  updateBasicInfoHandler,
  updatePasswordHandler,
} from './controller';
import '../../config/passport';
import { authenticated, validateResource } from '../../middleware';
import {
  changePasswordSchema,
  resetPasswordRequestSchema,
  loginWithEmailSchema,
  loginWithPhoneSchema,
  signupWithEmailSchema,
  signupWithPhoneSchema,
  updateUserBasicInfoSchema,
  resetPasswordSchema,
} from './schema';

const userRouter = express.Router();

userRouter.route('/').get(authenticated, getUsersHandler).delete(authenticated, deleteUserHandler);

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

userRouter.patch('/deactivate-account', authenticated, deactivateUserHandler);

userRouter.post('/reset-password-code', validateResource(resetPasswordRequestSchema), createPasswordResetCodeHandler);

userRouter.post('/reset-password', validateResource(resetPasswordSchema), resetPasswordHandler);

export default userRouter;
