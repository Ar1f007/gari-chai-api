import { z } from 'zod';
import { carTypeSchema, imageSchema } from '../../utils/helperSchema';
import extDayjs from '../../lib/dayjs';
import { minMaxPriceSchema, validMongoIdSchema } from '../../lib/zod/commonSchemas';

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
  body: payload.body
    .extend({
      cars: z
        .array(
          z.object({
            carId: validMongoIdSchema,
            type: carTypeSchema,
            campaignPrice: minMaxPriceSchema,
          }),
        )
        .refine((val) => val.length > 0, { message: 'Please select cars for campaign' }),
    })
    .superRefine(({ startDate, endDate }, ctx) => {
      const date1 = extDayjs(startDate);
      const date2 = extDayjs(endDate);

      const diff = date1.diff(date2);

      if (diff == 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start and End Date-Time can not be the same',
          path: ['startDate', 'endDate'],
          fatal: true,
        });
        return z.NEVER;
      }

      if (diff > 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start Date Can not be greater than end date',
          path: ['startDate', 'endDate'],
          fatal: true,
        });
        return z.NEVER;
      }

      const isStartDateInThePast = extDayjs().isBefore(date1);
      const isEndDateInThePast = extDayjs().isBefore(date2);

      if (!isStartDateInThePast || !isEndDateInThePast) {
        ctx.addIssue({
          code: 'custom',
          message: 'Start or End date time can not be in the past',
          path: ['startDate', 'endDate'],
          fatal: true,
        });

        return z.NEVER;
      }
    }),
};

const params = {
  params: z.object({
    id: validMongoIdSchema,
  }),
};

const query = {
  query: z.object({
    status: z.enum(['active', 'hidden']).optional(),
  }),
};

export const createBasicCampaignSchema = z.object({
  ...payload,
});

export const createCarCampaignSchema = z.object({
  ...carCampaignPayload,
});

export const updateCarCampaignSchema = z.object({
  ...params,
  ...carCampaignPayload,
});

export const deleteCarCampaignSchema = z.object({
  ...params,
});

export const getCampaignsSchema = z.object({
  ...query,
});

export type CreateCarCampaignInputs = z.infer<typeof createCarCampaignSchema>['body'];
export type GetCampaigns = z.infer<typeof getCampaignsSchema>;
export type UpdateCarCampaignInputs = z.infer<typeof updateCarCampaignSchema>;
export type DeleteCarCampaignInputs = z.infer<typeof deleteCarCampaignSchema>['params'];
