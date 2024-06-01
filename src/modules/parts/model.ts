import mongoose, { InferSchemaType } from 'mongoose';

const carPartSchema = new mongoose.Schema(
  {
    name: String,

    slug: {
      type: String,
      required: false,
      unique: true,
    },

    price: Number,

    discount: {
      type: Number,
      required: false,
      default: 0,
    },

    stock: Number,

    status: Boolean,

    warranty: {
      type: String,
      required: false,
    },

    manufacturer: {
      type: String,
      required: false,
    },

    posterImage: {
      type: {
        originalUrl: String,
        thumbnailUrl: String,
      },
      required: true,
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

    description: {
      type: String,
      required: false,
      default: null,
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
        validator: function (v: Record<string, unknown>) {
          const sizeInBytes = Buffer.from(JSON.stringify(v)).length;
          return sizeInBytes <= 8192; // 8 KB limit
        },
        message: 'Metadata size exceeds the maximum limit of 8 KB.',
      },
    },
  },
  {
    timestamps: true,
  },
);

export type CarPartDocument = InferSchemaType<typeof carPartSchema> & mongoose.Document;

export const CarPartModel = mongoose.model<CarPartDocument>('Car-Part', carPartSchema);
