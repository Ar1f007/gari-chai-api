import mongoose from 'mongoose';
import { CreateNewBrandInputs } from './schema';
import slugify from 'slugify';
import { nanoid } from 'nanoid';

export interface BrandDocument extends CreateNewBrandInputs, mongoose.Document {
  slug: string;
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

  const suffix = nanoid(3);

  brand.slug = slug + '-' + suffix;

  return next();
});

const BrandModel = mongoose.model<BrandDocument>('brand', brandSchema);

export default BrandModel;
