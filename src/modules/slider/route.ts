import express from 'express';
import { createSliderHandler } from './controller';

const sliderRouter = express.Router();

sliderRouter.post('/', createSliderHandler);

export default sliderRouter;
