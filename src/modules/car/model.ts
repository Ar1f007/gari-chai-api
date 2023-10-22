import mongoose from 'mongoose';
import { CarInputs } from './schema';

export interface CarDocument extends CarInputs, mongoose.Document {
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
      required: true,
      unique: true,
    },

    year: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    brandName: {
      type: String,
      required: true,
    },

    modelNumber: {
      type: String,
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
        required: true,
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
      type: [String],
      required: false,
    },

    infotainmentSystem: {
      type: String,
      required: false,
    },

    imageUrls: {
      type: [String],
      required: true,
    },

    mileage: {
      type: Number,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    scratchesOrDents: {
      type: String,
      required: true,
    },

    tireCondition: {
      type: String,
      enum: ['good', 'bad'],
      required: true,
    },

    handsShifted: {
      type: Number,
      required: true,
      default: 0,
    },
    acCondition: {
      type: String,
      required: false,
    },

    interiorCondition: {
      type: String,
      required: true,
    },

    baseInteriorColor: {
      type: String,
      required: true,
    },

    entertainmentSystemDefault: {
      type: Boolean,
      required: false,
    },
    soundSystemNewlyInstalled: {
      type: Boolean,
      required: false,
    },
    glass: {
      type: String,
      enum: ['new', 'built-in'],
      required: false,
    },

    accidentHistory: {
      hasAccidentHistory: {
        type: Boolean,
        required: false,
      },
      partsHit: {
        type: String,
        required: false,
      },
    },
    originalLights: {
      type: Boolean,
      required: true,
    },
    customization: {
      type: Boolean,
      required: false,
    },
    drivenByOwner: {
      type: Boolean,
      required: false,
    },
    engineOilChangeEveryThreeMonths: {
      type: Boolean,
      required: false,
    },
    registrationYear: {
      type: Number,
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
    numberOfDoors: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Car = mongoose.model<CarDocument>('Car', carSchema);

export default Car;
