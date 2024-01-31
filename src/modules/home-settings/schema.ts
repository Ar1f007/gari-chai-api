import { z } from 'zod';

// make sure it is synced with ADMIN's Home settings slug/section names
const sectionNameEnum = z.enum([
  'most-searched-cars',
  'latest-cars',
  'popular-cars',
  'electric-cars',
  'upcoming-cars',
  'services',
  'popular-brands',
]);

const homeSettingSchema = z.object({
  contentId: z.string(),
  sectionName: sectionNameEnum,
  content: z.any(),
  tags: z.array(z.string()).optional(),
  sort: z.number().default(0),
  metaData: z.record(z.string().min(1), z.unknown()).optional().default({}),
});

const payload = {
  body: homeSettingSchema,
};

const updatePayloadBody = {
  ...payload,
};

const params = {
  params: z.object({
    sectionName: sectionNameEnum,
  }),
};

const query = {
  query: z.object({
    sectionName: z.optional(sectionNameEnum),
  }),
};

export const createNewHomeSettingsSchema = z.object({
  ...payload,
});

// Validate single setting
export const getHomeSettingSchema = z.object({
  ...params,
  ...query,
});

// Validate for all settings
export const getHomeSettingsQuerySchema = z.object({
  ...query,
});

export const updateHomeSettingItemSchema = z.object({
  ...updatePayloadBody,
  ...params,
});

export const deleteHomeSettingItemSchema = z.object({
  ...params,
  body: z.object({
    itemId: z.string(),
  }),
});

export type CreateHomeSettingInputs = z.infer<typeof createNewHomeSettingsSchema>['body'];
export type ReadHomeSettingInput = z.infer<typeof getHomeSettingSchema>;
export type UpdateHomeSettingItemInput = z.infer<typeof updateHomeSettingItemSchema>;
export type DeleteHomeSettingItemInput = z.infer<typeof deleteHomeSettingItemSchema>;
