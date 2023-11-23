import { z } from 'zod';
import { validMongoIdSchema } from '../../../lib/zod/commonSchemas';

export const selectOption = z.object({
  value: z.string(),
  label: z.string(),
});

export const engineSchemaBasic = z.object({
  type: z.string(),
  displacement: z.number().optional(),
  horsePower: z.number().optional(),
  torque: z.number().optional(),
  condition: z.string().optional(),
});

const payload = {
  body: z.object({
    name: z.string(),

    year: z.number(),

    registrationYear: z.number(),

    description: z.string().optional(),

    brand: validMongoIdSchema,

    bodyStyle: validMongoIdSchema,

    modelNumber: z.number(),

    engine: engineSchemaBasic,

    transmission: z.string(),

    fuel: z.object({
      type: z.string(),
      economy: z
        .object({
          city: z.number().optional(),
          highway: z.number().optional(),
        })
        .optional(),
    }),

    acceleration: z
      .object({
        zeroTo60: z.number().optional(),
        topSpeed: z.number().optional(),
      })
      .optional(),

    safetyFeatures: z.string().optional(),

    infotainmentSystem: z.string().optional(),

    mileage: z.number(),

    imageUrls: z.array(z.string().url()).optional(),

    color: z.string(),

    baseInteriorColor: z.string(),

    numberOfDoors: z.number(),

    posterImage: z.object({
      originalUrl: z.string().url(),
      thumbnailUrl: z.string().url(),
    }),

    price: z.number(),

    tags: z.array(selectOption).optional().default([]),

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
