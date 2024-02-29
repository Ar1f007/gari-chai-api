import { CreateNewReviewInputs } from './schema';
import ReviewModel, { ReviewDocument } from './model';

import mongoose, { FilterQuery, ObjectId, QueryOptions, UpdateQuery } from 'mongoose';
import { TReviewsWithStats } from '../../types';

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

export async function findReviewsWithStats(carId: string): Promise<TReviewsWithStats> {
  const pipeline: mongoose.PipelineStage[] = [
    { $match: { carId: new mongoose.Types.ObjectId(carId) } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userInfo',
      },
    },
    {
      $addFields: {
        userInfo: { $arrayElemAt: ['$userInfo', 0] },
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        reviews: {
          $push: {
            $mergeObjects: [
              '$$ROOT',
              {
                userInfo: {
                  _id: '$userInfo._id',
                  firstName: '$userInfo.firstName',
                  lastName: '$userInfo.lastName',
                  profilePicture: '$userInfo.profilePicture',
                },
              },
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        averageRating: 1,
        totalReviews: 1,
        reviews: { $slice: ['$reviews', 10] },
      },
    },
  ];

  const results = await ReviewModel.aggregate(pipeline);

  return results[0];
}

// New method for counting documents
export async function countReviews(query: FilterQuery<ReviewDocument>) {
  return ReviewModel.countDocuments(query);
}
