import mongoose from 'mongoose';
import { CreateSliderInputs } from './schema';

export interface SliderDocument extends CreateSliderInputs, mongoose.Document {
  sort: number;
  createdAt: Date;
  updatedAt: Date;
}

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },

    link: {
      type: String,
      required: false,
      default: '/',
    },

    imgUrl: {
      type: String,
      required: [true, 'Slider image is required'],
    },

    showTitle: {
      type: Boolean,
      required: false,
      default: true,
    },

    status: {
      type: String,
      enum: ['active', 'hidden'],
      default: 'active',
    },

    sort: {
      type: Number,
      required: false,
      default: 0,
    },

    type: {
      type: String,
      enum: ['mobile', 'desktop'],
    },

    isSponsored: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: {},
    },

    sliderStyle: {
      type: {
        textColor: {
          type: String,
          default: '',
        },
        bgColor: {
          type: String,
          default: '',
        },
      },
      default: {},
      required: false,
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export const SliderModel = mongoose.model('Slider', sliderSchema);
