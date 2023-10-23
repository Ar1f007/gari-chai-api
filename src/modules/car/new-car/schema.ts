import { z } from 'zod';

export const engineSchemaBasic = z.object({
  type: z.string(),
  displacement: z.string().optional(),
  horsePower: z.number().optional(),
  torque: z.number().optional(),
});

export const createNewCarSchema = z.object({
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
});

export type CreateNewCarInputs = z.infer<typeof createNewCarSchema>['body'];
