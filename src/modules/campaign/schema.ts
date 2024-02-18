import { z } from 'zod';
import { carTypeSchema, imageSchema } from '../../utils/helperSchema';
import extDayjs from '../../lib/dayjs';
import { validMongoIdSchema } from '../../lib/zod/commonSchemas';

const payload = {
  body: z.object({
    title: z.string().min(1, 'Please add a title').max(100, 'Too Long (max 100 characters)'),

    tagline: z.string().optional(),

    description: z.string().optional(),

    startDate: z.union([
      z.string().refine(
        (val) => {
          const parsedDate = extDayjs(val);

          return parsedDate.isValid();
        },
        { message: 'Invalid date time format Ex: 2024-02-18T11:30:00.000Z' },
      ),
      z.date({
        required_error: 'Please select a start date and time',
        invalid_type_error: 'Invalid date format',
      }),
    ]),

    endDate: z.union([
      z.string().refine(
        (val) => {
          const parsedDate = extDayjs(val);

          return parsedDate.isValid();
        },
        { message: 'Invalid date time format Ex: 2024-02-18T11:30:00.000Z' },
      ),
      z.date({
        required_error: 'Please select an end date and time',
        invalid_type_error: 'Invalid date format',
      }),
    ]),

    isActive: z.boolean(),

    posterImage: imageSchema,

    metaData: z.record(z.string().min(1), z.unknown()).optional().default({}),
  }),
};

const carCampaignPayload = {
  body: payload.body.extend({
    cars: z
      .array(
        z.object({
          carId: validMongoIdSchema,
          type: carTypeSchema,
          campaignPrice: z.number(),
        }),
      )
      .refine((val) => val.length > 0, { message: 'Please select cars for campaign' }),
  }),
};

export const createBasicCampaignSchema = z.object({
  ...payload,
});

export const createCarCampaignSchema = z.object({
  ...carCampaignPayload,
});

export type CreateCarCampaignInputs = z.infer<typeof createCarCampaignSchema>['body'];
