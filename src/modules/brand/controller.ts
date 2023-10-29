import { Request, Response } from 'express';
import { createNewBrand, deleteBrand, findAndUpdateBrand, findBrand, findBrands } from './service';
import { CreateNewBrandInputs, DeleteBrandInput, ReadBrandInput, UpdateBrandInput } from './schema';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../utils/appError';

export async function createBrandHandler(req: Request<{}, {}, CreateNewBrandInputs>, res: Response) {
  const brand = await createNewBrand(req.body);

  if (!brand) {
    throw new AppError('Could not create brand', StatusCodes.BAD_REQUEST);
  }

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: brand,
    message: 'Brand created successfully',
  });
}

export async function getBrandsHandler(req: Request<{}, {}, {}, ReadBrandInput['query']>, res: Response) {
  // if in query params, "get=all" is present then return all the brands without filtering.
  // hence we set to filtering value "greater than or equal" to 0, if not get="all", then we are
  // getting each brand which has at least one car into its collection

  const query = {
    carCollectionCount: { $gte: req.query.get === 'all' ? 0 : 1 },
  };

  const brands = await findBrands(query);

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: brands,
  });
}

export async function getBrandHandler(req: Request<ReadBrandInput['params']>, res: Response) {
  const brandSlug = req.params.brandSlug;

  const brand = await findBrand({ slug: brandSlug });

  if (!brand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'Brand was not found',
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: brand,
  });
}

export async function updateBrandHandler(
  req: Request<UpdateBrandInput['params'], {}, UpdateBrandInput['body']>,
  res: Response,
) {
  const brandSlug = req.params.brandSlug;
  const update = req.body;

  const brand = await findBrand({ slug: brandSlug });

  if (!brand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No brand found',
    });
  }

  const updatedBrand = await findAndUpdateBrand({ slug: brandSlug }, update, {
    new: true,
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedBrand,
  });
}

export async function deleteBrandHandler(req: Request<DeleteBrandInput['params']>, res: Response) {
  const brandSlug = req.params.brandSlug;

  const brand = await findBrand({ slug: brandSlug });

  if (!brand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No brand was found',
    });
  }

  await deleteBrand({ slug: brandSlug });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Brand was deleted',
  });
}
