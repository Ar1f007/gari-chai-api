import { Request, Response } from 'express';
import {
  createNewBrandModel,
  deleteBrandModel,
  findAndUpdateBrandModel,
  findBrandModel,
  findBrandModels,
  findModelsByBrand,
} from './service';
import { CreateNewBrandModelInputs, DeleteBrandModelInput, ReadBrandModelInput, UpdateBrandModelInput } from './schema';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';
import slugify from 'slugify';
import { findBrand } from '../brand/service';
import { findAndUpdateManyCar } from '../car/new-car';
import { BrandModelDocument } from './model';
import {
  CAR_MODEL_BRAND_LABEL_PATH,
  CAR_MODEL_BRAND_MODEL_LABEL_PATH,
  CAR_MODEL_BRAND_MODEL_PATH,
  CAR_MODEL_BRAND_PATH,
} from '../../constants';

export async function createBrandModelHandler(req: Request<{}, {}, CreateNewBrandModelInputs>, res: Response) {
  const brandExists = await findBrand({ _id: req.body.brand });

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

function transformBrandModelBySection(models: BrandModelDocument[]) {
  const data = models.reduce(
    (acc, cur) => {
      cur.upcoming ? acc.upcomingModels.push(cur) : acc.existingModels.push(cur);

      return acc;
    },
    { existingModels: [], upcomingModels: [] } as {
      existingModels: BrandModelDocument[];
      upcomingModels: BrandModelDocument[];
    },
  );

  return data;
}

export async function getBrandModelsHandler(req: Request<{}, {}, {}, ReadBrandModelInput['query']>, res: Response) {
  // if in query params, "get=all" is present then return all the brandModels without filtering.
  // hence we set to filtering value "greater than or equal" to 0, if not get="all", then we are
  // getting each brandModel which has at least one car into its collection

  const query = {
    carCollectionCount: { $gte: req.query.get === 'all' ? 0 : 1 },
  };

  const brandModels: BrandModelDocument[] = await findBrandModels(query, {
    populate: 'brand',
  });

  // if "1" is present that means we want to get models separated by existing and upcoming model
  if (req.query.transform === '1') {
    const data = transformBrandModelBySection(brandModels);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: data,
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: brandModels,
  });
}

export async function getModelsByBrand(
  req: Request<ReadBrandModelInput['params'], {}, {}, ReadBrandModelInput['query']>,
  res: Response,
) {
  const brandId = req.params.id;

  const transform = req.query.transform;

  const brandModels = await findModelsByBrand({ brand: brandId });

  if (transform === '1') {
    const data = transformBrandModelBySection(brandModels);

    return res.status(StatusCodes.OK).json({
      status: 'success',
      data: data,
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: brandModels,
  });
}

export async function updateBrandModelHandler(
  req: Request<UpdateBrandModelInput['params'], {}, UpdateBrandModelInput['body']>,
  res: Response,
) {
  const modelId = req.params.id;
  const update = req.body;

  const query = { _id: modelId };
  const brandModel = await findBrandModel(query);

  if (!brandModel) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No model found',
    });
  }

  const updatedBrandModel = await findAndUpdateBrandModel(query, update, {
    new: true,
    populate: 'brand',
  });

  // update the brand name of car
  // TODO

  if (updatedBrandModel) {
    const updateOperations: Record<string, string> = {};

    if (brandModel.name !== req.body.name) {
      updateOperations[CAR_MODEL_BRAND_MODEL_LABEL_PATH] = updatedBrandModel.name;
    }

    // we have a new brand / or the car model's brand is changed to something else
    if (brandModel.brand !== req.body.brand) {
      updateOperations[CAR_MODEL_BRAND_LABEL_PATH] = updatedBrandModel.brand.name;
      updateOperations[CAR_MODEL_BRAND_PATH] = updatedBrandModel.brand._id;
    }

    findAndUpdateManyCar({ [CAR_MODEL_BRAND_MODEL_PATH]: updatedBrandModel.id }, updateOperations);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedBrandModel,
  });
}

export async function deleteBrandModelHandler(req: Request<{}, DeleteBrandModelInput['params']>, res: Response) {
  const { id } = req.body;

  if (!id) {
    throw new AppError('ID is required', StatusCodes.BAD_REQUEST);
  }

  const query = { _id: id };

  const brandModel = await findBrandModel(query);

  if (!brandModel) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No brand model was found',
    });
  }

  if (brandModel.carCollectionCount > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Can not delete this model. It is associated with a car',
    });
  }

  await deleteBrandModel(query);

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Model was deleted',
  });
}
