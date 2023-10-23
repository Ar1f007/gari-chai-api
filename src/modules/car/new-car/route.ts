import express from 'express';
import asyncHandler from 'express-async-handler';

import { createCarHandler } from './controller';
import validateResource from '../../../middleware/validateResource';
import { createNewCarSchema } from './schema';

export const carRouter = express.Router();

carRouter.route('/').post(validateResource(createNewCarSchema), asyncHandler(createCarHandler));
