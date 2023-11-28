import mongoose from 'mongoose';
import { CreateNewBrandInputs } from './schema';
import slugify from 'slugify';

export interface BrandDocument extends CreateNewBrandInputs, mongoose.Document {
  slug: string;
  carCollectionCount: number;
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
