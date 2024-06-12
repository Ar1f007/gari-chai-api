import express from 'express';
import { createSliderHandler, deleteSliderHandler, getSlidersHandler, updateSliderHandler } from './controller';
import { authenticated, validateResource } from '../../middleware';
import { updateSliderIdSchema } from './schema';

const sliderRouter = express.Router();

sliderRouter.route('/').post(authenticated, createSliderHandler).get(getSlidersHandler);

sliderRouter
  .route('/:id')
  .put(authenticated, validateResource(updateSliderIdSchema), updateSliderHandler)
  .delete(authenticated, validateResource(updateSliderIdSchema), deleteSliderHandler);

export default sliderRouter;
