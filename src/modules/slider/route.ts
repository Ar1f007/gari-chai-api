import express from 'express';
import { createSliderHandler, deleteSliderHandler, getSlidersHandler, updateSliderHandler } from './controller';
import { validateResource } from '../../middleware';
import { updateSliderIdSchema } from './schema';

const sliderRouter = express.Router();

sliderRouter.route('/').post(createSliderHandler).get(getSlidersHandler);

sliderRouter
  .route('/:id')
  .put(validateResource(updateSliderIdSchema), updateSliderHandler)
  .delete(validateResource(updateSliderIdSchema), deleteSliderHandler);

export default sliderRouter;
