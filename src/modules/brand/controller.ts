import { Request, Response } from 'express';
import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';

import { createNewBrand, deleteBrand, findAndUpdateBrand, findBrand, findBrands } from './service';
import { CreateNewBrandInputs, DeleteBrandInput, ReadBrandInput, UpdateBrandInput } from './schema';

import AppError from '../../utils/appError';

import { findSettingContents } from '../home-settings';
import { findAndUpdateManyCar } from '../car/new-car';

export async function createBrandHandler(req: Request<{}, {}, CreateNewBrandInputs>, res: Response) {
  const slugifiedValue = slugify(req.body.name, {
    lower: true,
  });

  const brandWithSameNameExist = await findBrand({ slug: slugifiedValue });

  if (brandWithSameNameExist) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Brand with the same name already exists!',
    });
  }

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

  // update the brand name of in car documents
  if (updatedBrand) {
    findAndUpdateManyCar({ 'brand.id': updatedBrand.id }, { 'brand.name': updatedBrand.name });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: updatedBrand,
  });
}

export async function deleteBrandHandler(req: Request<DeleteBrandInput['params']>, res: Response) {
  const { id } = req.body;

  const brand = await findBrand({ _id: id });

  if (!brand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No Brand was found',
    });
  }

  if (brand.carCollectionCount > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'Can not delete this brand. It has a car attached to it.',
    });
  }

  await deleteBrand({ _id: brand._id });

  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Brand was deleted',
  });
}

/**
 * Retrieves the popular brands and all brands with at least one car collection from the database
 * and sends the retrieved data as a JSON response.
 *
 * @param req The Express request object.
 * @param res The Express response object.
 */
export async function getAllAndPopularBrandsHandler(req: Request, res: Response) {
  // Retrieve popular brands from the database
  const popularBrands = await findSettingContents({ sectionName: 'popular-brands' }, { content: 1, _id: 0 });

  // Retrieve all brands with at least one car collection from the database
  const query = { carCollectionCount: { $gte: 0 } };
  const fieldsToPick = { name: 1, slug: 1 };
  const allBrands = await findBrands(query, fieldsToPick);

  const brands = popularBrands.map((brand) => ({
    name: brand.content.name,
    slug: brand.content.slug,
    _id: brand.content._id,
  }));

  const payload = {
    popularBrands: brands,
    allBrands: allBrands,
  };

  // Send the retrieved data as a JSON response
  res.status(StatusCodes.OK).json({
    status: 'success',
    data: payload,
  });
}
