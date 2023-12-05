import mongoose from 'mongoose';
import { CreateSliderInputs } from './schema';

export interface SliderDocument extends CreateSliderInputs, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const sliderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },

    sliderLink: {
      type: String,
      required: false,
      default: '/',
    },

    sliderImg: {
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
      enum: ['show', 'hide'],
      default: 'show',
    },
  },
  {
    timestamps: true,
  },
);

export const SliderModel = mongoose.model('Slider', sliderSchema);
