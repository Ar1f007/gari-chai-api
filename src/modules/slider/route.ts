import express from 'express';
import { createSliderHandler, getSlidersHandler, updateSliderHandler } from './controller';
import { validateResource } from '../../middleware';
import { updateSliderIdSchema } from './schema';

const sliderRouter = express.Router();

sliderRouter.post('/', createSliderHandler);

sliderRouter.get('/', getSlidersHandler);

sliderRouter.put('/:id', validateResource(updateSliderIdSchema), updateSliderHandler);

export default sliderRouter;
