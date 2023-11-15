import mongoose from 'mongoose';
import { CreateNewReviewInputs } from './schema';

export interface ReviewDocument extends CreateNewReviewInputs, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    unhelpfulCount: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const ReviewModel = mongoose.model<ReviewDocument>('review', reviewSchema);

export default ReviewModel;
