import { CreateNewReviewInputs } from './schema';
import ReviewModel, { ReviewDocument } from './model';

import { FilterQuery, ObjectId, QueryOptions, UpdateQuery } from 'mongoose';

export async function createNewReview(input: CreateNewReviewInputs) {
  return ReviewModel.create(input);
}

export async function findReview(query: FilterQuery<ReviewDocument>, options: QueryOptions = { lean: true }) {
  const result = await ReviewModel.findOne(query, {}, options);

  return result;
}

export async function findReviewById(id: ObjectId, options: QueryOptions = { lean: true }) {
  const result = await ReviewModel.findById(id, options);

  return result;
}

export async function findReviews(query: FilterQuery<ReviewDocument> = {}, options: QueryOptions = { lean: true }) {
  const results = await ReviewModel.find(query, {}, options);

  return results;
}

export async function findAndUpdateReview(
  query: FilterQuery<ReviewDocument>,
  update: UpdateQuery<ReviewDocument>,
  options: QueryOptions,
) {
  return ReviewModel.findOneAndUpdate(query, update, options);
}

export async function deleteReview(query: FilterQuery<ReviewDocument>) {
  return ReviewModel.deleteOne(query);
}
