import { Request, Response } from 'express';
import {
  createManyHomeSetting,
  createNewHomeSetting,
  deleteSettingItem,
  findAndUpdateSettingItem,
  findSettingContent,
  findSettingContents,
} from './service';
import AppError from '../../utils/appError';
import { StatusCodes } from 'http-status-codes';
import { DeleteHomeSettingItemInput, ReadHomeSettingInput, UpdateHomeSettingItemInput } from './schema';

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

export async function createMultipleHomeSettingsHandler(req: Request, res: Response) {
  const doc = await createManyHomeSetting(req.body);

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

  // const r = await HomeSetting.aggregate([
  //   {
  //     $sort: { sort: -1 }, // Sort the documents in descending order by the 'sort' field
  //   },
  //   {
  //     $group: {
  //       _id: '$sectionName',
  //       items: { $push: '$$ROOT' },
  //     },
  //   },
  // ]);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: settingContents,
  });
}

export async function homeSettingBySlugHandler(req: Request<ReadHomeSettingInput['params']>, res: Response) {
  const contents = await findSettingContents({ sectionName: req.params.sectionName }, { sort: { sort: -1 } });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: contents,
  });
}

export async function homeSettingItemUpdateHandler(
  req: Request<UpdateHomeSettingItemInput['params'], {}, UpdateHomeSettingItemInput['body']>,
  res: Response,
) {
  const update = req.body;

  const content = await findSettingContent({ contentId: update.contentId });

  if (!content) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No item was found',
    });
  }

  const updatedItem = await findAndUpdateSettingItem({ _id: content._id }, update, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedItem,
  });
}

export async function deleteSettingItemHandler(
  req: Request<{}, {}, DeleteHomeSettingItemInput['body']>,
  res: Response,
) {
  const itemId = req.body.itemId;

  const content = await findSettingContent({ _id: itemId });

  if (!content) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No item was found',
    });
  }

  await deleteSettingItem({ _id: itemId });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Item was deleted',
  });
}
