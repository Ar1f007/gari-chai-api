import express from 'express';
import { authenticated, validateResource } from '../../middleware';
import {
  createNewHomeSettingsSchema,
  deleteHomeSettingItemSchema,
  getHomeSettingSchema,
  getHomeSettingsQuerySchema,
  updateHomeSettingItemSchema,
} from './schema';
import {
  createHomeSettingHandler,
  createMultipleHomeSettingsHandler,
  deleteSettingItemHandler,
  getHomeSettingsHandler,
  homeSettingBySlugHandler,
  homeSettingItemUpdateHandler,
} from './controller';
export const homeSettingRouter = express.Router();

homeSettingRouter
  .route('/')
  .post(authenticated, validateResource(createNewHomeSettingsSchema), createHomeSettingHandler)
  .get(validateResource(getHomeSettingsQuerySchema), getHomeSettingsHandler);

homeSettingRouter.route('/popular-brands').post(authenticated, createMultipleHomeSettingsHandler);

homeSettingRouter.route('/car-parts').post(authenticated, createMultipleHomeSettingsHandler);

homeSettingRouter
  .route('/:sectionName')
  .get(validateResource(getHomeSettingSchema), homeSettingBySlugHandler)
  .put(authenticated, validateResource(updateHomeSettingItemSchema), homeSettingItemUpdateHandler)
  .delete(authenticated, validateResource(deleteHomeSettingItemSchema), deleteSettingItemHandler);
