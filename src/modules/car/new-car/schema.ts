import { z } from 'zod';
import { validMongoIdSchema } from '../../../lib/zod/commonSchemas';
import { numberOrNull, singleSpecificationSchema, xCharacterLong } from '../../../utils/helperSchema';

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

    brand: z.object({
      id: validMongoIdSchema,
      name: z.string().min(1),
    }),

    brandModel: z.object({
      id: validMongoIdSchema,
      name: z.string().min(1),
    }),

    tags: z.array(selectOption).optional().default([]),

    bodyStyle: z.object({
      id: validMongoIdSchema,
      name: z.string().min(1),
    }),

    seatingCapacity: z.number(),

    numOfDoors: z.number(),

    colors: z.array(
      z.object({
        name: z.string(),
        imageUrls: z.optional(z.array(z.string().url())),
      }),
    ),
    transmission: z.string(),

    fuel: z.object({
      typeInfo: z.object({
        type: z.string(),
        fullForm: z.string(),
      }),
    }),

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

    launchedAt: z.preprocess(
      (arg) => {
        if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
      },
      z.date({
        required_error: 'Please select a date and time',
        invalid_type_error: "That's not a date!",
      }),
    ),

    posterImage: z.object({
      originalUrl: z.string().url(),
      thumbnailUrl: z.string().url(),
    }),

    imageUrls: z.array(z.string().url()).optional(),

    description: z.optional(
      z.string().refine((val) => {
        if (val) {
          return val.length >= 200;
        }
        return true;
      }, 'Description is optional, but if you want add one, then make sure it is at least 200 characters long'),
    ),

    cities: z.array(z.string()).optional(),

    carType: z.string().optional(),

    videoUrls: z
      .array(
        z.object({
          thumbnailUrl: z.string().url().optional(),
          url: z.string().url(),
        }),
      )
      .optional()
      .default([]),
  }),
};

const params = {
  params: z.object({
    carSlug: z.string({
      required_error: 'car slug is required',
    }),
  }),
};

const query = {
  query: z.object({
    brand: z.string().optional(),
    tags: z.string().optional(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
  }),
};

export const createNewCarSchema = z.object({
  ...payload,
});

export const updateCarSchema = z.object({
  ...payload,
  ...params,
});

export const deleteCarSchema = z.object({
  ...params,
});

export const getCarSchema = z.object({
  ...params,
  ...query,
});

export type CreateNewCarInputs = z.infer<typeof createNewCarSchema>['body'];
export type ReadCarInput = z.infer<typeof getCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
export type DeleteCarInput = z.infer<typeof deleteCarSchema>;
