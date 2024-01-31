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
    metaData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (v: Record<string, unknown>) {
          const sizeInBytes = Buffer.from(JSON.stringify(v)).length;
          return sizeInBytes <= 8192; // 8 KB limit
        },
        message: 'Metadata size exceeds the maximum limit of 8 KB.',
      },
    },
  },
  {
    timestamps: true,
  },
);

const VendorModel = mongoose.model<VendorDocument>('Vendor', vendorModelSchema);

export default VendorModel;
