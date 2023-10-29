import express from 'express';
import { validateResource } from '../../middleware';
import { createNewHomeSettingsSchema, getHomeSettingSchema, getHomeSettingsQuerySchema } from './schema';
import { createHomeSettingHandler, getHomeSettingsHandler, homeSettingBySlugHandler } from './controller';
export const homeSettingRouter = express.Router();

homeSettingRouter
  .route('/')
  .post(validateResource(createNewHomeSettingsSchema), createHomeSettingHandler)
  .get(validateResource(getHomeSettingsQuerySchema), getHomeSettingsHandler);

homeSettingRouter.route('/:sectionName').get(validateResource(getHomeSettingSchema), homeSettingBySlugHandler);
