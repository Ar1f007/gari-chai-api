import mongoose, { FilterQuery, QueryOptions } from 'mongoose';
import VendorModel, { VendorDocument } from './model';
import { AddVendorSchema } from './schema';

export function createVendor(input: AddVendorSchema) {
  return VendorModel.create(input);
}

export function findVendor(query: FilterQuery<VendorDocument>, options: QueryOptions = { lean: true }) {
  return VendorModel.findOne(query, {}, options);
}

export function findAllVendors(query: FilterQuery<VendorDocument> = {}, options: QueryOptions = { lean: true }) {
  return VendorModel.find(query, {}, options);
}

export function deleteVendor(id: VendorDocument['_id']) {
  return VendorModel.findByIdAndDelete(id);
}

export async function updateVendorCarCollectionCount({
  type,
  vendorId,
}: {
  type: 'inc' | 'dec';
  vendorId: mongoose.Types.ObjectId | string;
}) {
  const brandModel = await VendorModel.findOneAndUpdate(
    { _id: vendorId },
    {
      $inc: {
        carCollectionCount: type === 'inc' ? 1 : -1,
      },
    },
    {
      new: true,
    },
  );

  return brandModel;
}
