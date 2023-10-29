import express from 'express';
import { validateResource } from '../../middleware';
import { createNewHomeSettingsSchema } from './schema';
import { createHomeSettingHandler } from './controller';
export const homeSettingRouter = express.Router();

homeSettingRouter.route('/').post(validateResource(createNewHomeSettingsSchema), createHomeSettingHandler);
