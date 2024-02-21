import mongoose, { Document, Schema, InferSchemaType } from 'mongoose';
import { CAR_CAMPAIGN } from '../../constants';

const campaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    tagline: {
      type: String,
      required: false,
      default: '',
    },

    description: {
      type: String,
      required: false,
      default: '',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    posterImage: {
      type: {
        originalUrl: String,
        thumbnailUrl: String,
      },
      required: true,
    },
    sort: {
      type: Number,
      required: false,
      default: 0,
    },
    campaignLink: {
      type: String,
      required: false,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      // TODO: MAKE IT REQUIRED
      required: false,
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
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const carCampaignSchema = new Schema({
  newCars: [
    {
      car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: [true, 'Car id is required'],
      },
      campaignPrice: {
        type: {
          min: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
          },
          max: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
          },
        },
        required: true,
      },
    },
  ],
  usedCars: [
    {
      car: {
        type: Schema.Types.ObjectId,
        ref: 'Used-Car',
        required: [true, 'Car id is required'],
      },
      campaignPrice: {
        type: {
          min: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
          },
          max: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
          },
        },
        required: true,
      },
    },
  ],
});

export type CampaignDocument = InferSchemaType<typeof campaignSchema> & Document;

export type CarCampaignDocument = InferSchemaType<typeof carCampaignSchema> & Document;

export const CampaignModel = mongoose.model('Campaign', campaignSchema);
export const CarCampaignModel = CampaignModel.discriminator(CAR_CAMPAIGN, carCampaignSchema);
