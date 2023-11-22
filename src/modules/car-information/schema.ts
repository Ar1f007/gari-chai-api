import { z } from 'zod';

export const vehicleTypeCreateSchema = z.object({
  body: z.object({
    name: z.string(),
  }),
});

export type VehicleTypeCreateInputs = z.infer<typeof vehicleTypeCreateSchema>['body'];
