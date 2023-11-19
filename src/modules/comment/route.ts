import express from 'express';
import { validateResource } from '../../middleware';
import { createCommentSchema, getCommentsSchema } from './schema';
import { createCommentHandler, getCommentsHandler } from './controller';
import { authenticateUser } from '../../middleware/authenticateUser';

const commentRouter = express.Router();

commentRouter.route('/').post(authenticateUser, validateResource(createCommentSchema), createCommentHandler);
commentRouter.route('/:carId').get(validateResource(getCommentsSchema), getCommentsHandler);

export default commentRouter;
