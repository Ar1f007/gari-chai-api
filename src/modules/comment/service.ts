import { FilterQuery, QueryOptions } from 'mongoose';
import CommentModel, { CommentDocument } from './model';
import { CreateCommentBody, createCommentBodySchema } from './schema';

export async function createComment(input: CreateCommentBody) {
  createCommentBodySchema.parse(input);
  return CommentModel.create(input);
}

export async function findComment(query: FilterQuery<CommentDocument>, options: QueryOptions = { lean: true }) {
  return CommentModel.findOne(query, {}, options);
}

export async function findComments(query: FilterQuery<CommentDocument> = {}, options: QueryOptions = { lean: true }) {
  return CommentModel.find(query, {}, options);
}
