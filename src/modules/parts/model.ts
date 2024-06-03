import mongoose, { InferSchemaType } from 'mongoose';
import slugify from 'slugify';

const carPartSchema = new mongoose.Schema(
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

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      required: false,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
    },

    status: {
      type: Boolean,
      required: true,
    },

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

carPartSchema.pre('save', async function (next) {
  let carPart = this as CarPartDocument;

  const slug = slugify(carPart.name, {
    lower: true,
  });

  carPart.slug = slug;

  return next();
});

export const CarPartModel = mongoose.model<CarPartDocument>('Car-Part', carPartSchema);
