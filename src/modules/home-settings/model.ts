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

const HomeSetting = mongoose.model<HomeSettingDocument>('Home-Setting', homeSettingSchema);

export default HomeSetting;
