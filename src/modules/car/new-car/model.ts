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
      default: '',
    },

    vendor: {
      type: {
        value: {
          type: Schema.Types.ObjectId,
          ref: 'Vendor',
          required: [true, 'Vendor id is required'],
        },
        label: {
          type: String,
          required: [true, 'Vendor name is required'],
        },
      },
    },

    brand: {
      type: {
        value: {
          type: Schema.Types.ObjectId,
          ref: 'Brand',
          required: [true, 'brand id is required'],
        },
        label: {
          type: String,
          required: [true, 'brand name is required'],
        },
      },
    },

    brandModel: {
      type: {
        value: {
          type: Schema.Types.ObjectId,
          ref: 'Brand-Model',
          required: [true, 'brand model id required'],
        },
        label: {
          type: String,
          required: [true, 'brand model is required'],
        },
      },
    },

    bodyStyle: {
      type: {
        value: {
          type: Schema.Types.ObjectId,
          ref: 'Car-Body-Type',
          required: [true, 'car body type is required'],
        },
        label: {
          type: String,
          required: [true, 'body style name is required'],
        },
      },
    },

    transmission: {
      type: String,
      required: true,
    },

    fuel: [
      {
        label: String,
        value: {
          fuelType: String,
          fullForm: String,
        },
      },
    ],

    imageUrls: {
      type: [
        {
          type: {
            originalUrl: String,
            thumbnailUrl: String,
          },
        },
      ],
      required: false,
      default: [],
    },

    panoramaImages: {
      type: [
        {
          originalUrl: String,
          thumbnailUrl: String,
          title: String,
        },
      ],
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
            type: [
              {
                key: String,
                url: {
                  type: {
                    originalUrl: String,
                    thumbnailUrl: String,
                  },
                },
              },
            ],
            required: false,
            default: [],
          },
        },
      ],
      default: [],
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
      default: new Date(),
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
                valueType: { value: String, label: String },
              },
            ],
          },
        },
      ],
      default: [],
    },

    additionalSpecifications: {
      type: [
        {
          name: String,
          value: mongoose.Schema.Types.Mixed,
          valueType: {
            value: String,
            label: String,
          },
        },
      ],
      default: [],
    },
    cities: {
      type: [
        {
          value: String,
          label: String,
        },
      ],
      default: [
        {
          value: 'all',
          label: 'All',
        },
      ],
    },
    carType: {
      type: String,
      default: 'new',
    },
    videos: {
      type: [
        {
          link: String,
          thumbnailImage: {
            type: {
              originalUrl: String,
              thumbnailUrl: String,
            },
            required: false,
          },
        },
      ],
      default: [],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    metaData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      validate: {
        validator: function (v: Record<string, any>) {
          const sizeInBytes = Buffer.from(JSON.stringify(v)).length;
          return sizeInBytes <= 8192; // 8 KB limit
        },
        message: 'Metadata size exceeds the maximum limit of 8 KB.',
      },
      required: false,
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

carSchema.index({ 'bodyStyle.label': 1 });
carSchema.index({ 'brand.label': 1 });
carSchema.index({ 'brandModel.label': 1 });
carSchema.index({ 'fuel.value.fuelType': 1 });
carSchema.index({ 'price.min': 1, 'price.max': 1 });
carSchema.index({ 'tags.value': 1 });
carSchema.index({ launchedAt: 1 });
carSchema.index({ name: 1 });
carSchema.index({ numOfDoors: 1 });
carSchema.index({ seatingCapacity: 1 });
carSchema.index({ transmission: 'text' });

const Car = mongoose.model<CarDocument>('Car', carSchema);

export default Car;
