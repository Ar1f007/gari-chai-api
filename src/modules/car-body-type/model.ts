import mongoose from 'mongoose';
import slugify from 'slugify';
import { CarBodyTypeCreateInputs } from './schema';

export interface CarBodyTypeDocument extends CarBodyTypeCreateInputs, mongoose.Document {
  slug: string;
  metaData?: {
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

const carBodyTypeSchema = new mongoose.Schema(
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
      required: false,
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

carBodyTypeSchema.pre('save', async function (next) {
  let doc = this as CarBodyTypeDocument;

  const slug = slugify(doc.name, {
    lower: true,
  });

  doc.slug = slug;

  return next();
});

const CarBodyTypeModel = mongoose.model<CarBodyTypeDocument>('Car-Body-Type', carBodyTypeSchema);

export default CarBodyTypeModel;
