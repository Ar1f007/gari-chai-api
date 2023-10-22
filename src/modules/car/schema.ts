import { z } from 'zod';

/**
 * TODO: ADD THESE TWO LATER
 * entertainmentSystemDefault: z.boolean(),
 * soundSystemNewlyInstalled: z.boolean(),
 */
const engineSchemaBasic = z.object({
  type: z.string(),
  displacement: z.string().optional(),
  horsePower: z.number().optional(),
  torque: z.number().optional(),
});

const usedCardEngineSchema = engineSchemaBasic.extend({ condition: z.enum(['good', 'bad', 'medium']) });

export const createNewCarSchema = z.object({
  body: z.object({
    name: z.string(),

    year: z.number(),

    registrationYear: z.number(),

    description: z.string(),

    brandName: z.string(),

    modelNumber: z.string(),

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

export const createUsedCarSchema = createNewCarSchema.shape.body.extend({
  engine: usedCardEngineSchema,

  scratchesOrDents: z.string(),

  tireCondition: z.enum(['good', 'bad', 'medium']),

  handsShifted: z.number(),

  acCondition: z.string(),

  interiorCondition: z.string(),

  glass: z.enum(['new', 'built-in']).optional(),

  accidentHistory: z.object({
    hasAccidentHistory: z.boolean(),
    partsHit: z.string(),
  }),

  originalLights: z.boolean(),

  customization: z.boolean().optional(),

  drivenByOwner: z.boolean().optional(),

  engineOilChangeEveryThreeMonths: z.boolean().optional(),

  paintHistory: z.string(),

  taxToken: z.string(),

  fitness: z.string(),

  nameTransferPossibility: z.boolean(),

  smartCard: z.boolean(),

  firstPartyInsurance: z.boolean(),
});

export const carSchema = z.object({
  body: z.object({
    name: z.string().min(1),

    year: z.number(),

    description: z.string().min(1),

    brandName: z.string().min(1),

    modelNumber: z.string().min(1),

    engine: z.object({
      type: z.string().min(1),
      displacement: z.string().optional(),
      horsePower: z.number().optional(),
      torque: z.number().optional(),
      condition: z.enum(['good', 'bad', 'medium']),
    }),

    transmission: z.string().min(1),

    bodyStyle: z.string().min(1),

    fuel: z.object({
      type: z.string().min(1),
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
        topSpeed: z.string().optional(),
      })
      .optional(),

    safetyFeatures: z.array(z.string()).optional(),

    infotainmentSystem: z.string().min(1),

    imageUrls: z.array(z.string()),

    mileage: z.number(),

    color: z.string().min(1),

    scratchesOrDents: z.string(),

    tireCondition: z.enum(['good', 'bad', 'medium']),

    handsShifted: z.number(),

    acCondition: z.string(),

    interiorCondition: z.string(),

    baseInteriorColor: z.string(),

    entertainmentSystemDefault: z.boolean(),

    soundSystemNewlyInstalled: z.boolean(),

    glass: z.enum(['new', 'built-in']).optional(),

    accidentHistory: z.object({
      hasAccidentHistory: z.boolean(),
      partsHit: z.string(),
    }),

    originalLights: z.boolean(),

    customization: z.boolean().optional(),

    drivenByOwner: z.boolean().optional(),

    engineOilChangeEveryThreeMonths: z.boolean().optional(),

    registrationYear: z.number(),

    paintHistory: z.string(),

    taxToken: z.string(),

    fitness: z.string(),

    numberOfDoors: z.number(),

    nameTransferPossibility: z.boolean(),

    smartCard: z.boolean(),

    firstPartyInsurance: z.boolean(),
  }),
});

export type CreateNewCarInputs = z.infer<typeof createNewCarSchema>['body'];

export type CreateUsedCarInputs = z.infer<typeof createUsedCarSchema>;
