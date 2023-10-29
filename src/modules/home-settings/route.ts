import express from 'express';
import { validateResource } from '../../middleware';
import {
  createNewHomeSettingsSchema,
  deleteHomeSettingItemSchema,
  getHomeSettingSchema,
  getHomeSettingsQuerySchema,
  updateHomeSettingItemSchema,
} from './schema';
import {
  createHomeSettingHandler,
  deleteSettingItemHandler,
  getHomeSettingsHandler,
  homeSettingBySlugHandler,
  homeSettingItemUpdateHandler,
} from './controller';
export const homeSettingRouter = express.Router();

homeSettingRouter
  .route('/')
  .post(validateResource(createNewHomeSettingsSchema), createHomeSettingHandler)
  .get(validateResource(getHomeSettingsQuerySchema), getHomeSettingsHandler);

homeSettingRouter
  .route('/:sectionName')
  .get(validateResource(getHomeSettingSchema), homeSettingBySlugHandler)
  .put(validateResource(updateHomeSettingItemSchema), homeSettingItemUpdateHandler)
  .delete(validateResource(deleteHomeSettingItemSchema), deleteSettingItemHandler);
