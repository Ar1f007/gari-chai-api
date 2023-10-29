import { z } from 'zod';

const sectionNameEnum = z.enum(['most-searched', 'latest-cars', 'popular-cars', 'electric-cars', 'services']);

const payload = {
  body: z.object({
    contentId: z.string(),
    sectionName: sectionNameEnum,
    content: z.any(),
    tags: z.array(z.string()).optional(),
    sort: z.number().default(0),
  }),
};

const updatePayloadBody = {
  body: z.object({
    contentId: z.string(),
    sectionName: sectionNameEnum,
    tags: z.array(z.string()).optional(),
    sort: z.number().default(0),
  }),
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
/**
 * Most Searched cars
 *  - SUV
 *  - Sedan
 *  - Hatchback
 * Latest
 * Electric cars
 *  - Popular
 *  - Upcoming
 *  - Latest
 * Services
 */
