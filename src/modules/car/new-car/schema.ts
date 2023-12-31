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

    fuel: z.object({
      typeInfo: z.object({
        label: z.string(),
        value: z.object({
          type: z.string(),
          fullForm: z.string(),
        }),
      }),
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

    imageUrls: z.array(imageSchema).optional(),

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
  query: z.object({
    name: z.string().optional(),
    brand: z.string().optional(),
    tags: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    launchedDate: z.coerce
      .date({
        invalid_type_error: 'launchedBeforeOrEqual Requires a date string',
      })
      .optional(),
    launchedAt: z
      .union([z.enum(['past', 'future']), z.literal('past.future').or(z.literal('future.past'))])
      .default('past')
      .optional(),
    sort: sortSchema.optional(),
  }),
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
