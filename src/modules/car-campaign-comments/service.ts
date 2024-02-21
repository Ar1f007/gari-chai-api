import { CarCampaignCommentModel, NewCarCampaignComment, NewCarCampaignCommentDocument } from './model';
import { FilterQuery, QueryOptions, SortOrder } from 'mongoose';
import { CreateNewCarCampaignComment } from './schema';

export type CreateCarCampaignCommentParams = {};

export async function createCarCampaignComment(input: Partial<CreateNewCarCampaignComment['body']>) {
  return NewCarCampaignComment.create(input);
}

export async function findCarCampaignComments(
  query: FilterQuery<NewCarCampaignCommentDocument> = {},
  options: QueryOptions = { lean: true },
  sortOptions: Record<string, SortOrder> = { content: -1 },
) {
  const results = await CarCampaignCommentModel.find(query, {}, options).sort(sortOptions);

  return results;
}
