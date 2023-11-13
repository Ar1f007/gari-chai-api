import express from 'express';
import { validateResource } from '../../middleware';
import { createUserSchema, verifyOTPSchema } from './schema';
import { createNewUserHandler, getMeHandler, verifyOTPHandler } from './controller';
import { authenticateUser } from '../../middleware/authenticateUser';

const userRouter = express.Router();

userRouter.route('/').post(validateResource(createUserSchema), createNewUserHandler);

userRouter.post('/verify-otp', validateResource(verifyOTPSchema), verifyOTPHandler);

userRouter.get('/me', authenticateUser, getMeHandler);

export default userRouter;
