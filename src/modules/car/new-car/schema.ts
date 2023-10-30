import { z } from 'zod';

export const engineSchemaBasic = z.object({
  type: z.string(),
  displacement: z.number().optional(),
  horsePower: z.number().optional(),
  torque: z.number().optional(),
});

const payload = {
  body: z.object({
    name: z.string(),

    year: z.number(),

    registrationYear: z.number(),

    description: z.string().optional(),

    brand: z.object({
      slug: z.string(),
      name: z.string(),
    }),

    modelNumber: z.number(),

    engine: engineSchemaBasic,

    transmission: z.string(),

    bodyStyle: z.string(),

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

    imageUrls: z.array(z.string()).optional(),

    color: z.string(),

    baseInteriorColor: z.string(),

    numberOfDoors: z.number(),

    posterImage: z.object({
      originalUrl: z.string().url(),
      thumbnailUrl: z.string().url(),
    }),
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
