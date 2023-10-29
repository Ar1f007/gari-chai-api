import mongoose from 'mongoose';
import { CreateHomeSettingInputs } from './schema';

export interface HomeSettingDocument extends CreateHomeSettingInputs, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
}

const homeSettingSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
      default: [],
    },
    sort: {
      type: Number,
      required: false,
      default: 0,
    },
    contentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const HomeSetting = mongoose.model<HomeSettingDocument>('HomeSetting', homeSettingSchema);

export default HomeSetting;
