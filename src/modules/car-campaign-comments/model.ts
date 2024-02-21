import mongoose, { Document, Schema, InferSchemaType } from 'mongoose';

const carCampaignCommentSchema = new Schema(
  {
    content: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    pinToTop: { type: Boolean, default: false },
    reports: { type: Number, default: 0 },
    carType: {
      type: String,
      enum: ['new', 'used'],
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
  { timestamps: true },
);

const newCarCampaignCommentSchema = new Schema({
  car: { type: Schema.Types.ObjectId, ref: 'Car', required: true },
});

const usedCarCampaignCommentSchema = new Schema({
  car: { type: Schema.Types.ObjectId, ref: 'Used-Car', required: true },
});

export const CarCampaignCommentModel = mongoose.model('Campaign-Comment', carCampaignCommentSchema);

export const NewCarCampaignComment = CarCampaignCommentModel.discriminator(
  'NewCarComment',
  newCarCampaignCommentSchema,
);

export const UsedCarCampaignComment = CarCampaignCommentModel.discriminator(
  'UsedCarComment',
  usedCarCampaignCommentSchema,
);

export type CarCampaignCommentDocument = InferSchemaType<typeof carCampaignCommentSchema> & Document;

export type NewCarCampaignCommentDocument = InferSchemaType<typeof newCarCampaignCommentSchema> & Document;

export type UsedCarCampaignCommentDocument = InferSchemaType<typeof usedCarCampaignCommentSchema> & Document;
