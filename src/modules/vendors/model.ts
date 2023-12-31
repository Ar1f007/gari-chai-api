import mongoose from 'mongoose';
import { AddVendorSchema } from './schema';

export interface VendorDocument extends AddVendorSchema, mongoose.Document {
  carCollectionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const vendorModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: false,
      default: '',
    },

    address: {
      type: String,
      required: false,
      default: '',
    },

    image: {
      thumbnailUrl: {
        type: String,
        required: false,
      },
      originalUrl: {
        type: String,
        required: false,
      },
    },

    carCollectionCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const VendorModel = mongoose.model<VendorDocument>('Vendor', vendorModelSchema);

export default VendorModel;
