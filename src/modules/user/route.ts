import express from 'express';
import { validateResource } from '../../middleware';
import { createUserSchema, verifyOTPSchema } from './schema';
import { createNewUserHandler, verifyOTPHandler } from './controller';

const userRouter = express.Router();

userRouter.route('/').post(validateResource(createUserSchema), createNewUserHandler);

userRouter.post('/verify-otp', validateResource(verifyOTPSchema), verifyOTPHandler);

export default userRouter;
