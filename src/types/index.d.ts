import { ReviewDocument } from '../modules/review/model';

export type Status = 'success' | 'fail' | 'error' | 'validationError';

export type TReqUser = {
  id: any;
  name: string;
  role: string[];
  phoneNumber: string;
};

type ReviewWithStat = ReviewDocument & {
  userInfo: {
    name: string;
    _id: string;
    image?: string;
  };
};

export type TReviewsWithStats = {
  averageRating: number;
  totalReviews: number;
  reviews: ReviewWithStat[];
};
