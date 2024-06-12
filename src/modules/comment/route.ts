import express from 'express';
import { authenticated, validateResource } from '../../middleware';
import { createCommentSchema, deleteCommentSchema, getCommentsSchema, updateCommentSchema } from './schema';
import {
  createCommentHandler,
  deleteCommentHandler,
  editCommentContentHandler,
  getCommentsHandler,
} from './controller';

const commentRouter = express.Router();

commentRouter.route('/').post(authenticated, validateResource(createCommentSchema), createCommentHandler);
commentRouter
  .route('/:id')
  .get(validateResource(getCommentsSchema), getCommentsHandler)
  .patch(authenticated, validateResource(updateCommentSchema), editCommentContentHandler)
  .delete(authenticated, validateResource(deleteCommentSchema), deleteCommentHandler);

export default commentRouter;
