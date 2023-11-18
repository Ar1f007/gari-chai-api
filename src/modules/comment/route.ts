import express from 'express';
import { validateResource } from '../../middleware';
import { createCommentSchema, getCommentsSchema } from './schema';
import { createCommentHandler, getCommentsHandler } from './controller';

const commentRouter = express.Router();

commentRouter.route('/').post(validateResource(createCommentSchema), createCommentHandler);
commentRouter.route('/:carId').get(validateResource(getCommentsSchema), getCommentsHandler);

export default commentRouter;
