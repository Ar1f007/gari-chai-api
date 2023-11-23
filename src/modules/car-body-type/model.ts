import mongoose from 'mongoose';
import slugify from 'slugify';
import { CarBodyTypeCreateInputs } from './schema';

export interface CarBodyTypeDocument extends CarBodyTypeCreateInputs, mongoose.Document {
  slug: string;
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

const CarBodyTypeModel = mongoose.model<CarBodyTypeDocument>('car-body-type', carBodyTypeSchema);

export default CarBodyTypeModel;
