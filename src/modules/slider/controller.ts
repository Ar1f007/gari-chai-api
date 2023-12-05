import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createSlider } from './service';

export async function createSliderHandler(req: Request, res: Response) {
  const doc = await createSlider(req.body);

  if (!doc) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Could not add slider',
    });
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: doc,
    message: 'Slider added successfully',
  });
}
