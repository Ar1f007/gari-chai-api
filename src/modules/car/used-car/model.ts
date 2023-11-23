import mongoose, { Schema } from 'mongoose';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { CreateUsedCarInputs } from './schema';

export interface UsedCarDocument extends CreateUsedCarInputs, mongoose.Document {
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const usedCarSchema = new mongoose.Schema(
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
      type: Schema.Types.ObjectId,
      ref: 'brand',
      required: [true, 'Brand is required'],
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
      required: false,
    },

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

    numberOfDoors: {
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
      type: Number,
      required: false,
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
      required: [true, 'A date is required'],
    },

    scratchesOrDents: {
      type: String,
      required: true,
    },

    tireCondition: {
      type: String,
      enum: ['good', 'bad', 'medium'],
      required: true,
    },

    handsShifted: {
      type: Number,
      required: true,
    },
    acCondition: {
      type: String,
      required: true,
    },

    interiorCondition: {
      type: String,
      required: true,
    },

    // entertainmentSystemDefault: {
    //   type: Boolean,
    //   required: true,
    // },
    // soundSystemNewlyInstalled: {
    //   type: Boolean,
    //   required: true,
    // },
    glass: {
      type: String,
      enum: ['new', 'built-in'],
      required: true,
    },

    accidentHistory: {
      hasAccidentHistory: {
        type: Boolean,
        required: true,
      },
      partsHit: {
        type: String,
        required: true,
      },
    },
    originalLights: {
      type: Boolean,
      required: true,
    },
    customization: {
      type: Boolean,
      required: true,
    },
    drivenByOwner: {
      type: Boolean,
      required: true,
    },
    engineOilChangeEveryThreeMonths: {
      type: Boolean,
      required: true,
    },

    paintHistory: {
      type: String,
      required: true,
    },

    taxToken: {
      type: String,
      required: true,
    },

    fitness: {
      type: String,
      required: true,
    },

    nameTransferPossibility: {
      type: Boolean,
      required: true,
    },

    smartCard: {
      type: Boolean,
      required: true,
    },

    firstPartyInsurance: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

usedCarSchema.pre('save', async function (next) {
  let car = this as UsedCarDocument;

  const slug = slugify(car.name, {
    lower: true,
  });

  const suffix = nanoid(3);

  car.slug = slug + '-' + suffix;

  return next();
});

const UsedCar = mongoose.model<UsedCarDocument>('Used-Car', usedCarSchema);

export default UsedCar;
