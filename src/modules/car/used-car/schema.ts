// import { z } from 'zod';
// import { createNewCarSchema, engineSchemaBasic } from '../new-car/schema';

// /**
//  * TODO: ADD THESE TWO LATER
//  * entertainmentSystemDefault: z.boolean(),
//  * soundSystemNewlyInstalled: z.boolean(),
//  */

// const usedCardEngineSchema = engineSchemaBasic.extend({ condition: z.enum(['good', 'bad', 'medium']) });

// const payload = {
//   body: createNewCarSchema.shape.body.extend({
//     engine: usedCardEngineSchema,

//     scratchesOrDents: z.string(),

//     tireCondition: z.enum(['good', 'bad', 'medium']),

//     handsShifted: z.number(),

//     acCondition: z.string(),

//     interiorCondition: z.string(),

//     glass: z.enum(['new', 'built-in']).optional(),

//     accidentHistory: z.object({
//       hasAccidentHistory: z.boolean(),
//       partsHit: z.string(),
//     }),

//     originalLights: z.boolean(),

//     customization: z.boolean().optional(),

//     drivenByOwner: z.boolean().optional(),

//     engineOilChangeEveryThreeMonths: z.boolean().optional(),

//     paintHistory: z.string(),

//     taxToken: z.string(),

//     fitness: z.string(),

//     nameTransferPossibility: z.boolean(),

//     smartCard: z.boolean(),

//     firstPartyInsurance: z.boolean(),
//   }),
// };

// const params = {
//   params: z.object({
//     carSlug: z.string({
//       required_error: 'car slug is required',
//     }),
//   }),
// };

// export const createUsedCarSchema = z.object({
//   ...payload,
// });

// export const updateUsedCarSchema = z.object({
//   ...payload,
//   ...params,
// });

// export const deleteUsedCarSchema = z.object({
//   ...params,
// });

// export const getUsedCarSchema = z.object({
//   ...params,
// });

// export type CreateUsedCarInputs = z.infer<typeof createUsedCarSchema>['body'];
// export type ReadUsedCarInput = z.infer<typeof getUsedCarSchema>;
// export type UpdateUsedCarInput = z.infer<typeof updateUsedCarSchema>;
// export type DeleteUsedCarInput = z.infer<typeof deleteUsedCarSchema>;
