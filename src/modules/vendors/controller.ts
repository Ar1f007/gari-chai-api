import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AddVendorSchema, UpdateVendorInfoParams } from './schema';
import { createVendor, deleteVendor, findAllVendors, findAndUpdateVendor, findVendor } from './service';
import AppError from '../../utils/appError';

export async function createVendorHandler(req: Request<{}, {}, AddVendorSchema>, res: Response) {
  const doc = await createVendor(req.body);

  if (!doc) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: 'Could not add body type',
    });
  }

  return res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: doc,
  });
}

export async function getAllVendorsHandler(req: Request, res: Response) {
  const vendors = await findAllVendors();

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: vendors,
  });
}

export async function updateVendorInfoHandler(
  req: Request<UpdateVendorInfoParams['params'], {}, UpdateVendorInfoParams['body']>,
  res: Response,
) {
  const vendorId = req.params.id;

  const updateInfo = req.body;

  const vendor = await findAndUpdateVendor({ _id: vendorId }, updateInfo, {
    new: true,
  });

  if (!vendor) {
    return res.status(StatusCodes.NOT_FOUND).json({
      status: 'fail',
      message: 'No Vendor was found',
    });
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: vendor,
  });
}

export async function deleteVendorHandler(req: Request, res: Response) {
  const { id } = req.body;

  if (!id) {
    throw new AppError('ID is required', StatusCodes.BAD_REQUEST);
  }

  const vendor = await findVendor({ _id: id });

  if (!vendor) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: 'No vendor was found',
    });
  }

  if (vendor.carCollectionCount > 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'fail',
      message: `Can not delete this vendor, it has ${vendor.carCollectionCount} cars collection`,
    });
  }

  await deleteVendor(id);

  return res.status(StatusCodes.OK).json({
    status: 'success',
    data: null,
  });
}
