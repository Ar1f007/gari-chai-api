import { Request, Response } from 'express';
import {
  createNewBrandModel,
  deleteBrandModel,
  findAndUpdateBrandModel,
  findBrandModel,
  findBrandModels,
} from './service';
import { CreateNewBrandModelInputs, DeleteBrandModelInput, ReadBrandModelInput, UpdateBrandModelInput } from './schema';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';
import slugify from 'slugify';
import { findBrand } from '../brand/service';

export async function createBrandModelHandler(req: Request<{}, {}, CreateNewBrandModelInputs>, res: Response) {
  const brandExists = await findBrand({ slug: req.body.brandSlug });

  if (!brandExists) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'The brand you have chosen does not exists',
    });
  }

  const slugifiedValue = slugify(req.body.name, {
    lower: true,
  });

  const brandModelWithSameNameExist = await findBrandModel({ slug: slugifiedValue });

  if (brandModelWithSameNameExist) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Brand Model with the same name already exists!',
    });
  }

  const brandModel = await createNewBrandModel({ ...req.body, brand: brandExists._id });

  if (!brandModel) {
    throw new AppError('Could not create brand model', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: brandModel,
    message: 'Brand model created successfully',
  });
}

export async function getBrandModelsHandler(req: Request<{}, {}, {}, ReadBrandModelInput['query']>, res: Response) {
  // if in query params, "get=all" is present then return all the brandModels without filtering.
  // hence we set to filtering value "greater than or equal" to 0, if not get="all", then we are
  // getting each brandModel which has at least one car into its collection

  const query = {
    carCollectionCount: { $gte: req.query.get === 'all' ? 0 : 1 },
  };

  const brandModels = await findBrandModels(query);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: brandModels,
  });
}

export async function getBrandModelHandler(req: Request<ReadBrandModelInput['params']>, res: Response) {
  const brandModelSlug = req.params.brandModelSlug;

  const brandModel = await findBrandModel({ slug: brandModelSlug });

  if (!brandModel) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'Model was not found',
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: brandModel,
  });
}

export async function updateBrandModelHandler(
  req: Request<UpdateBrandModelInput['params'], {}, UpdateBrandModelInput['body']>,
  res: Response,
) {
  const brandModelSlug = req.params.brandModelSlug;
  const update = req.body;

  const brandModel = await findBrandModel({ slug: brandModelSlug });

  if (!brandModel) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No model found',
    });
  }

  const updatedBrandModel = await findAndUpdateBrandModel({ slug: brandModelSlug }, update, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedBrandModel,
  });
}

export async function deleteBrandModelHandler(req: Request<DeleteBrandModelInput['params']>, res: Response) {
  const brandModelSlug = req.params.brandModelSlug;

  const brandModel = await findBrandModel({ slug: brandModelSlug });

  if (!brandModel) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No brand model was found',
    });
  }

  await deleteBrandModel({ slug: brandModelSlug });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Model was deleted',
  });
}
