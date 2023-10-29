import { Request, Response } from 'express';
import { createNewHomeSetting, findSettingContents } from './service';
import AppError from '../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import { ReadHomeSettingInput } from './schema';

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

export async function getHomeSettingsHandler(
  req: Request<ReadHomeSettingInput['params'], {}, {}, ReadHomeSettingInput['query']>,
  res: Response,
) {
  const { sectionName } = req.query;

  let query = {} as ReadHomeSettingInput['query'];

  if (sectionName) {
    query.sectionName = sectionName;
  }

  const settingContents = await findSettingContents(query);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: settingContents,
  });
}

export async function homeSettingBySlugHandler(req: Request<ReadHomeSettingInput['params']>, res: Response) {
  const contents = await findSettingContents({ sectionName: req.params.sectionName });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: contents,
  });
}
