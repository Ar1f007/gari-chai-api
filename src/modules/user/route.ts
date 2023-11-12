import express from 'express';
import { validateResource } from '../../middleware';
import { createUserSchema } from './schema';
import { createNewUserHandler } from './controller';

const userRouter = express.Router();

userRouter.route('/').post(validateResource(createUserSchema), createNewUserHandler);

export default userRouter;
