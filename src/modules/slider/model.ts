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
  },
  {
    timestamps: true,
  },
);

export const SliderModel = mongoose.model('Slider', sliderSchema);
