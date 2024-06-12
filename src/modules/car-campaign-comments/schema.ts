import { z } from 'zod';
import { validMongoIdSchema } from '../../lib/zod/commonSchemas';

const payload = {
  body: z.object({
    content: z.number(),
    user: validMongoIdSchema,
    campaign: validMongoIdSchema,
    car: validMongoIdSchema,
    carType: z.enum(['new', 'used']),

    pinToTop: z.boolean().optional(),
    reports: z.number().optional(),
    metaData: z.record(z.string().min(1), z.unknown()).optional().default({}),
  }),
};

const params = {
  params: z.object({
    campaignId: validMongoIdSchema,
    carId: validMongoIdSchema,
  }),
};

// const query = {
//   query: z
//     .object({
//       campaign: validMongoIdSchema,
//       car: validMongoIdSchema,
//       type: z.enum(['new', 'used']),
//     })
//     .partial(),
// };

export const createComForNewCarCampaign = z.object({
  ...payload,
});

export const getComForCampaign = z.object({
  ...params,
  // ...query,
});

export type CreateNewCarCampaignComment = z.infer<typeof createComForNewCarCampaign>;
export type ReadCommentsForCampaign = z.infer<typeof getComForCampaign>;
