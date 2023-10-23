import express from 'express';

import { createCarHandler } from './controller';
import { createNewCarSchema } from './schema';
import { validateResource } from '../../../middleware';

export const carRouter = express.Router();

carRouter.route('/').post(validateResource(createNewCarSchema), createCarHandler);
