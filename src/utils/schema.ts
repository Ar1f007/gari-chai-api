// Schemas which is used on web/admin

import { z } from 'zod';
import { imageSchema } from './helperSchema';

// when a new car is created or doc is created, then we can
// parse it using this schema

export const brandSchema = z.object({
  _id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  slug: z.string(),
  image: imageSchema,
});

export const brandModelSchema = z.object({
  _id: z.string(),
  name: z.string(),
  carCollectionCount: z.number(),
  brand: z.string(),
  upcoming: z.boolean(),
  slug: z.string(),
  image: imageSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const carBodyStylesSchema = z.object({
  _id: z.string(),
  name: z.string(),
  slug: z.string(),
  image: z.optional(imageSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const singleSpecificationSchema = z.object({
  name: z.string().min(1, 'name is required'),
  value: z.union([z.string().min(1, 'value is required'), z.boolean()]),
  valueType: z
    .object(
      {
        value: z.enum(['boolean', 'text']),
        label: z.string(),
      },
      {
        invalid_type_error: 'Please select a type',
        required_error: 'Please select a type',
      },
    )
    .transform((type) => type.value),
});

const attributeSchema = singleSpecificationSchema.extend({
  valueType: z.enum(['boolean', 'text']),
});

export const carSchema = z.object({
  _id: z.string(),

  name: z.string(),

  slug: z.string(),

  brand: z.object({
    value: z.union([z.string(), brandSchema, z.null()]),
    label: z.string(),
  }),

  brandModel: z.object({
    value: z.union([z.string(), brandModelSchema, z.null()]),
    label: z.string(),
  }),

  bodyStyle: z.object({
    value: z.union([z.string(), carBodyStylesSchema, z.null()]),
    label: z.string(),
  }),

  tags: z.array(z.object({ value: z.string(), label: z.string() })),

  transmission: z.string(),

  numOfDoors: z.number(),

  seatingCapacity: z.number(),

  fuel: z.object({
    typeInfo: z.object({
      value: z.object({
        type: z.string(),
        fullForm: z.string(),
      }),
      label: z.string(),
    }),
  }),

  colors: z
    .array(
      z.object({
        name: z.string(),
        imageUrls: z.array(
          z.object({
            key: z.string(),
            url: imageSchema,
          }),
        ),
      }),
    )
    .default([]),

  price: z.object({
    min: z.number(),
    max: z.number(),
    isNegotiable: z.boolean(),
  }),

  specificationsByGroup: z.array(
    z.object({
      groupName: z.string(),
      values: z.array(attributeSchema).default([]),
    }),
  ),

  additionalSpecifications: z.array(attributeSchema),

  posterImage: z.object({
    originalUrl: z.string().url(),
    thumbnailUrl: z.string().url(),
  }),

  imageUrls: z.array(imageSchema),

  videos: z
    .array(
      z.object({
        thumbnailImage: z.optional(imageSchema),
        link: z.string().url(),
      }),
    )
    .optional()
    .default([]),

  carType: z.enum(['new', 'used']),

  description: z.string().optional(),

  cities: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    }),
  ),

  launchedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  status: z.enum(['available', 'sold', 'reserved']),
  soldAt: z.string().optional(),
});
