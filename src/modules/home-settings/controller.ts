import { Request, Response } from 'express';
import { createNewHomeSetting } from './service';
import AppError from '../../utils/appError';
import { StatusCodes } from 'http-status-codes';

export async function createHomeSettingHandler(req: Request, res: Response) {
  const doc = await createNewHomeSetting(req.body);

  if (!doc) {
    throw new AppError('Could not add to the settings', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: doc,
  });
}
