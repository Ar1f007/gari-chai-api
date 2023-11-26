import mongoose, { Schema } from 'mongoose';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

import { CreateNewCarInputs } from './schema.js';

export interface CarDocument extends CreateNewCarInputs, mongoose.Document {
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  soldAt: Date;
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

    // year: {
    //   type: Number,
    //   required: true,
    // },

    // registrationYear: {
    //   type: Number,
    //   required: true,
    // },

    description: {
      type: String,
      required: false,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'brand is required'],
    },

    brandModel: {
      type: Schema.Types.ObjectId,
      ref: 'Brand-Model',
      required: [true, 'brand model is required'],
    },

    // modelNumber: {
    //   type: Number,
    //   required: true,
    // },

    engine: {
      type: {
        type: String,
        required: true,
      },
      numOfCylinders: {
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
      type: Schema.Types.ObjectId,
      ref: 'Car-Body-Type',
      required: [true, 'car body type is required'],
    },

    fuel: {
      typeInfo: {
        type: {
          type: String,
        },
        fullForm: {
          type: String,
        },
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

    // safetyFeatures: {
    //   type: String,
    //   required: false,
    // },

    // infotainmentSystem: {
    //   type: String,
    //   required: false,
    // },

    mileage: {
      type: Number,
      required: true,
    },

    imageUrls: {
      type: [String],
      required: false,
      default: [],
    },

    color: {
      type: String,
      required: true,
    },

    baseInteriorColor: {
      type: String,
      required: true,
    },

    numOfDoors: {
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
    price: {
      type: {
        min: {
          type: Number,
          required: true,
        },
        max: {
          type: Number,
          required: true,
        },
        isNegotiable: {
          type: Boolean,
          required: true,
        },
      },
    },
    tags: {
      type: [
        {
          value: String,
          label: String,
        },
      ],

      default: [],
    },
    launchedAt: {
      type: Date,
      required: [false, 'Launch date is required'],
    },
    status: {
      type: String,
      required: true,
      enum: ['available', 'sold', 'reserved'],
      default: 'available',
    },
    soldAt: {
      type: Date,
      required: false,
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },

    specificationsByGroup: {
      type: [
        {
          groupName: String,
          values: {
            type: [
              {
                name: String,
                value: mongoose.Schema.Types.Mixed,
                valueType: String,
              },
            ],
          },
        },
      ],
    },

    additionalSpecifications: {
      type: [
        {
          name: String,
          value: mongoose.Schema.Types.Mixed,
          valueType: String,
        },
      ],
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
