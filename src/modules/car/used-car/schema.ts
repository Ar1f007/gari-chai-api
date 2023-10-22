import { z } from 'zod';
import { createNewCarSchema, engineSchemaBasic } from '../new-car/schema';

/**
 * TODO: ADD THESE TWO LATER
 * entertainmentSystemDefault: z.boolean(),
 * soundSystemNewlyInstalled: z.boolean(),
 */

const usedCardEngineSchema = engineSchemaBasic.extend({ condition: z.enum(['good', 'bad', 'medium']) });

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

export type CreateUsedCarInputs = z.infer<typeof createUsedCarSchema>;
