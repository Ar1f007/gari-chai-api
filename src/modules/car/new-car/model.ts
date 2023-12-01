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

    description: {
      type: String,
      required: false,
    },

    brand: {
      type: {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Brand',
          required: [true, 'brand id is required'],
        },
        name: {
          type: String,
          required: [true, 'brand name is required'],
        },
      },
    },

    brandModel: {
      type: {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Brand-Model',
          required: [true, 'brand model id required'],
        },
        name: {
          type: String,
          required: [true, 'brand model is required'],
        },
      },
    },

    bodyStyle: {
      type: {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Car-Body-Type',
          required: [true, 'car body type is required'],
        },
        name: {
          type: String,
          required: [true, 'body style name is required'],
        },
      },
    },

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

    imageUrls: {
      type: [String],
      required: false,
      default: [],
    },

    colors: {
      type: [
        {
          name: {
            type: String,
            required: [true, 'Color name is required'],
          },
          imageUrls: {
            type: [String],
            required: false,
            default: [],
          },
        },
      ],
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
    cities: {
      type: [String],
      default: ['all'],
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
