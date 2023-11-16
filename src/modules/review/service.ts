import { CreateNewReviewInputs } from './schema';
import ReviewModel, { ReviewDocument } from './model';

import mongoose, { FilterQuery, ObjectId, QueryOptions, UpdateQuery } from 'mongoose';

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

export async function findReviewsWithStats(carId: string) {
  console.log(carId);
  const pipeline = [
    { $match: { carId: new mongoose.Types.ObjectId(carId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        reviews: { $push: '$$ROOT' },
      },
    },
    {
      $project: {
        _id: 0,
        averageRating: 1,
        totalReviews: 1,
        reviews: {
          $slice: ['$reviews', 10],
        },
      },
    },
  ];

  const results = await ReviewModel.aggregate(pipeline).sort({ createdAt: -1 });
  console.log(results[0].reviews!);
  return results[0];
}
