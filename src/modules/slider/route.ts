import express from 'express';
import { createSliderHandler, getSlidersHandler } from './controller';

const sliderRouter = express.Router();

sliderRouter.post('/', createSliderHandler);

sliderRouter.get('/', getSlidersHandler);

export default sliderRouter;
