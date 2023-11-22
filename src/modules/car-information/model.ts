import mongoose from 'mongoose';
import slugify from 'slugify';
import { VehicleTypeCreateInputs } from './schema';

export interface CarInformationDocument extends VehicleTypeCreateInputs, mongoose.Document {
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const carInformationSchema = new mongoose.Schema(
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

carInformationSchema.pre('save', async function (next) {
  let carInformation = this as CarInformationDocument;

  const slug = slugify(carInformation.name, {
    lower: true,
  });

  carInformation.slug = slug;

  return next();
});

const CarInformationModel = mongoose.model<CarInformationDocument>('car-information', carInformationSchema);

export default CarInformationModel;
