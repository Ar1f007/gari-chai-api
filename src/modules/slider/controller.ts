import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { createSlider, findSlider, getSliders, updateSlider } from './service';
import { SliderId, UpdateSliderInputs } from './schema';

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

export async function getSlidersHandler(req: Request, res: Response) {
  const sliders = await getSliders();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: sliders,
  });
}

export async function updateSliderHandler(req: Request<SliderId, {}, UpdateSliderInputs>, res: Response) {
  const sliderId = req.params.id;

  const slider = await findSlider(sliderId);

  if (!slider) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'No slider was found',
    });
  }

  const payload: UpdateSliderInputs = {
    title: req.body.title,
    imgUrl: req.body.imgUrl,
    showTitle: req.body.showTitle,
    sort: req.body.sort,
    status: req.body.status,
    type: req.body.type,
    link: req.body.link,
  };

  const updatedSlider = await updateSlider(slider.id, payload);

  if (!updatedSlider) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Could not update the slider',
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedSlider,
  });
}
