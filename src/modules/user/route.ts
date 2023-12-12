import express from 'express';
import { validateResource } from '../../middleware';
import { createUserSchema, loginUserSchema, sendOTPSchema, verifyOTPSchema } from './schema';
import {
  createNewUserHandler,
  getMeHandler,
  loginUserHandler,
  logoutUserHandler,
  sendOTPHandler,
  verifyOTPHandler,
} from './controller';
import { authenticateUser } from '../../middleware/authenticateUser';

const userRouter = express.Router();

userRouter.route('/').post(validateResource(createUserSchema), createNewUserHandler);

userRouter.get('/me', authenticateUser, getMeHandler);

userRouter.post('/login', validateResource(loginUserSchema), loginUserHandler);
userRouter.post('/logout', logoutUserHandler);
userRouter.post('/verify-otp', validateResource(verifyOTPSchema), verifyOTPHandler);
userRouter.post('/send-otp', validateResource(sendOTPSchema), sendOTPHandler);

export default userRouter;
