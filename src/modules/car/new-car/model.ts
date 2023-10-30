import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

import { CreateNewCarInputs } from './schema.js';

export interface CarDocument extends CreateNewCarInputs, mongoose.Document {
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: false,
      unique: true,
    },

    year: {
      type: Number,
      required: true,
    },

    registrationYear: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },

    brand: {
      slug: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },

    modelNumber: {
      type: Number,
      required: true,
    },

    engine: {
      type: {
        type: String,
        required: true,
      },
      displacement: {
        type: Number,
        required: false,
      },
      horsePower: {
        type: Number,
        required: false,
      },
      torque: {
        type: Number,
        required: false,
      },
      condition: {
        type: String,
        enum: ['good', 'bad', 'medium'],
        required: false,
      },
    },

    transmission: {
      type: String,
      required: true,
    },

    bodyStyle: {
      type: String,
      required: true,
    },

    fuel: {
      type: {
        type: String,
        required: true,
      },
      economy: {
        city: {
          type: Number,
          required: false,
        },
        highway: {
          type: Number,
          required: false,
        },
      },
    },

    acceleration: {
      zeroTo60: {
        type: Number,
        required: false,
      },

      topSpeed: {
        type: Number,
        required: false,
      },
    },

    safetyFeatures: {
      type: String,
      required: false,
    },

    infotainmentSystem: {
      type: String,
      required: true,
    },

    mileage: {
      type: Number,
      required: true,
    },

    posterImage: {
      type: {
        originalUrl: String,
        thumbnailUrl: String,
      },
      required: true,
    },

    imageUrls: {
      type: [String],
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    baseInteriorColor: {
      type: String,
      required: true,
    },

    numberOfDoors: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: false,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

carSchema.pre('save', async function (next) {
  let car = this as CarDocument;

  const slug = slugify(car.name, {
    lower: true,
  });

  const suffix = nanoid(3);

  car.slug = slug + '-' + suffix;

  return next();
});

const Car = mongoose.model<CarDocument>('Car', carSchema);

export default Car;
