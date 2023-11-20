import express from 'express';
import { validateResource } from '../../middleware';
import { createCommentSchema, deleteCommentSchema, getCommentsSchema, updateCommentSchema } from './schema';
import {
  createCommentHandler,
  deleteCommentHandler,
  editCommentContentHandler,
  getCommentsHandler,
} from './controller';
import { authenticateUser } from '../../middleware/authenticateUser';

const commentRouter = express.Router();

commentRouter.route('/').post(authenticateUser, validateResource(createCommentSchema), createCommentHandler);
commentRouter
  .route('/:id')
  .get(validateResource(getCommentsSchema), getCommentsHandler)
  .patch(authenticateUser, validateResource(updateCommentSchema), editCommentContentHandler)
  .delete(authenticateUser, validateResource(deleteCommentSchema), deleteCommentHandler);

export default commentRouter;
