import mongoose from 'mongoose';
import { CreateNewBrandInputs } from './schema';
import slugify from 'slugify';

export interface BrandDocument extends CreateNewBrandInputs, mongoose.Document {
  slug: string;
  carCollectionCount: number;
  metaData?: {
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
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

brandSchema.pre('save', async function (next) {
  let brand = this as BrandDocument;

  const slug = slugify(brand.name, {
    lower: true,
  });

  brand.slug = slug;

  return next();
});

const BrandModel = mongoose.model<BrandDocument>('Brand', brandSchema);

export default BrandModel;
