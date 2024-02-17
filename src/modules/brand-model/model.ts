import mongoose, { Document, Schema } from 'mongoose';
import { CreateNewBrandModelInputs } from './schema';
import slugify from 'slugify';

export interface BrandModelDocument extends CreateNewBrandModelInputs, mongoose.Document {
  brand: Document['_id'];
  slug: string;
  carCollectionCount: number;
  metaData?: {
    [key: string]: unknown;
  };

  createdAt: Date;
  updatedAt: Date;
}

const brandModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },

    carCollectionCount: {
      type: Number,
      default: 0,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
    },

    upcoming: {
      type: Boolean,
      default: false,
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

brandModelSchema.pre('save', async function (next) {
  let brandModel = this as BrandModelDocument;

  const slug = slugify(brandModel.name, {
    lower: true,
  });

  brandModel.slug = slug;

  return next();
});

const BrandModelModel = mongoose.model<BrandModelDocument>('Brand-Model', brandModelSchema);

export default BrandModelModel;
