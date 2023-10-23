import { z } from 'zod';

export const engineSchemaBasic = z.object({
  type: z.string(),
  displacement: z.string().optional(),
  horsePower: z.number().optional(),
  torque: z.number().optional(),
});

const payload = {
  body: z.object({
    name: z.string(),

    year: z.number(),

    registrationYear: z.number(),

    description: z.string(),

    brandName: z.string(),

    modelNumber: z.number(),

    engine: engineSchemaBasic,

    transmission: z.string(),

    bodyStyle: z.string(),

    fuel: z.object({
      type: z.string(),
      economy: z
        .object({
          city: z.string().optional(),
          highway: z.string().optional(),
        })
        .optional(),
    }),

    acceleration: z
      .object({
        zeroTo60: z.number().optional(),
        topSpeed: z.string().optional(),
      })
      .optional(),

    safetyFeatures: z.array(z.string()).optional(),

    infotainmentSystem: z.string(),

    mileage: z.number(),

    imageUrls: z.array(z.string()),

    color: z.string(),

    baseInteriorColor: z.string(),

    numberOfDoors: z.number(),
  }),
};

const params = {
  params: z.object({
    carSlug: z.string({
      required_error: 'car slug is required',
    }),
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
});

export type CreateNewCarInputs = z.infer<typeof createNewCarSchema>['body'];
export type ReadCarInput = z.infer<typeof getCarSchema>;
export type UpdateCarInput = z.infer<typeof updateCarSchema>;
export type DeleteCarInput = z.infer<typeof deleteCarSchema>;
