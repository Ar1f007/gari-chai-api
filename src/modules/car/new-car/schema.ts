import { z } from 'zod';
import { validMongoIdSchema } from '../../../lib/zod/commonSchemas';
import { imageSchema, numberOrNull, singleSpecificationSchema, xCharacterLong } from '../../../utils/helperSchema';

export const selectOption = z.object({
  value: z.string(),
  label: z.string(),
});

export const engineSchemaBasic = z.object({
  type: z.string(),
  numOfCylinders: numberOrNull,
  horsePower: numberOrNull,
  torque: numberOrNull,
  condition: z.string().optional(),
});

const payload = {
  body: z.object({
    name: z.string(),

    vendor: z.object({
      value: validMongoIdSchema,
      label: z.string().min(1),
    }),

    brand: z.object({
      value: validMongoIdSchema,
      label: z.string().min(1),
    }),

    brandModel: z.object({
      value: validMongoIdSchema,
      label: z.string().min(1),
    }),

    bodyStyle: z.object({
      value: validMongoIdSchema,
      label: z.string().min(1),
    }),

    tags: z.array(selectOption).optional().default([]),

    transmission: z.string(),

    seatingCapacity: z.number(),

    numOfDoors: z.number(),

    fuel: z
      .array(
        z.object({
          label: z.string(),
          value: z.object({
            fuelType: z.string(),
            fullForm: z.string(),
          }),
        }),
      )
      .refine((data) => data.length > 0, {
        message: 'Fuel type is not provided',
      }),

    colors: z.array(
      z.object({
        name: z.string(),
        imageUrls: z.optional(
          z.array(
            z.object({
              key: z.string(),
              url: imageSchema,
            }),
          ),
        ),
      }),
    ),

    price: z.object({
      min: z.number().min(1, 'required'),
      max: z.number().min(1, 'required'),
      isNegotiable: z.boolean(),
    }),

    specificationsByGroup: z
      .optional(
        z.array(
          z.object({
            groupName: z.string().min(3, xCharacterLong('Group name', 3)),
            values: z.array(singleSpecificationSchema),
          }),
        ),
      )
      .default([]),

    additionalSpecifications: z.optional(z.array(singleSpecificationSchema)).default([]),

    posterImage: z.object({
      originalUrl: z.string().url(),
      thumbnailUrl: z.string().url(),
    }),

    imageUrls: z
      .array(
        z.object({
          key: z.string(),
          url: imageSchema,
        }),
      )
      .optional(),

    panoramaImages: z
      .array(
        z.object({
          key: z.string(),
          title: z.string(),
          url: imageSchema,
        }),
      )
      .optional(),

    isVerified: z.boolean().optional(),

    videos: z
      .array(
        z.object({
          link: z.string().url(),
          thumbnailImage: imageSchema.optional(),
        }),
      )
      .optional()
      .default([]),

    carType: z.string().optional(),

    description: z.optional(
      z.string().refine((val) => {
        if (val) {
          return val.length >= 200;
        }
        return true;
      }, 'Description is optional, but if you want add one, then make sure it is at least 200 characters long'),
    ),

    cities: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        }),
      )
      .optional()
      .default([]),

    launchedAt: z.preprocess(
      (arg) => {
        if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
      },
      z.date({
        required_error: 'Please select a date and time',
        invalid_type_error: "That's not a date!",
      }),
    ),

    metaData: z.record(z.string().min(1), z.any()).optional().default({}),
  }),
};

const extCarPayload = {
  body: payload.body.extend({
    _id: validMongoIdSchema.optional(),
    slug: z.string().min(1),
    status: z.enum(['available', 'sold', 'reserved']),
    soldAt: z.string().optional(),
  }),
};

const refinedSort = z.string().refine((str) => str.includes(':'), {
  message: "Sort query must contain a colon (':')",
});

export const sortSchema = z.union([refinedSort, z.array(refinedSort)]);

const params = {
  params: z.object({
    carSlug: z.string({
      required_error: 'car slug is required',
    }),
  }),
};

const query = {
  query: z
    .object({
      bodyType: z.string(),
      brand: z.string(),
      budget: z.string().refine(
        (val) => {
          if (!val.includes('-')) return false;

          const values = val.split('-');

          return values.every((num) => !isNaN(Number(num)));
        },
        {
          message: "Invalid budget type, value must be separated by '-', and range value should be of type number",
        },
      ),
      car: z.enum(['new', 'used']),
      city: z.string(),

      fuelType: z.string(),

      launchedAt: z
        .union([z.enum(['past', 'future']), z.literal('past.future').or(z.literal('future.past'))])
        .default('past'),

      launchedDate: z.coerce.date({
        invalid_type_error: 'launchedBeforeOrEqual Requires a date string',
      }),

      limit: z.string().refine((val) => !isNaN(Number(val)), { message: 'Page limit should be of type number' }),
      model: z.string(),
      name: z.string(),
      seats: z.string().refine(
        (val) => {
          if (val.includes(',')) {
            const values = val.split(',');
            return values.every((num) => !isNaN(Number(num)));
          }

          return !isNaN(Number(val));
        },
        {
          message: 'Number of seats should be of type number',
        },
      ),
      page: z.string().refine((val) => !isNaN(Number(val)), { message: 'Page value should be of type number' }),
      query: z.string(),
      scope: z.enum(['new-car', 'used-car', 'global']),
      sort: sortSchema,
      tags: z.string(),
    })
    .partial(),
};

export const createNewCarSchema = z.object({
  ...payload,
});

export const updateCarSchema = z.object({
  ...extCarPayload,
  ...params,
});

export const deleteCarSchema = z.object({
  ...params,
});

export const deleteCarByIdSchema = z.object({
  body: z.object({
    _id: validMongoIdSchema,
    name: z.string(),
  }),
});

export const getCarSchema = z.object({
  ...params,
  ...query,
});

export const getCarQuerySchema = z.object({
  ...query,
});

export type GetCarQueryInput = z.infer<typeof getCarQuerySchema>;

export type CreateNewCarInputs = z.infer<typeof createNewCarSchema>['body'];
export type ReadCarInput = z.infer<typeof getCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
export type DeleteCarInput = z.infer<typeof deleteCarSchema>;
export type DeleteCarById = z.infer<typeof deleteCarByIdSchema>;
