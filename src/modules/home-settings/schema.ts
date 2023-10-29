import { z } from 'zod';

const payload = {
  body: z.object({
    contentId: z.string(),
    sectionName: z.enum(['most-searched', 'latest-cars', 'popular-cars', 'electric-cars', 'services']),
    content: z.any(),
    tags: z.array(z.string()).optional(),
    sort: z.number().default(0),
  }),
};

export const createNewHomeSettingsSchema = z.object({
  ...payload,
});

export type CreateHomeSettingInputs = z.infer<typeof createNewHomeSettingsSchema>['body'];

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
