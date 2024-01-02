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

  description: z.string().optional(),

  brand: z.object({
    id: z.union([z.string(), brandSchema, z.null()]),
    name: z.string(),
  }),

  brandModel: z.object({
    id: z.union([z.string(), brandModelSchema, z.null()]),
    name: z.string(),
  }),

  transmission: z.string(),

  bodyStyle: z.object({
    id: z.union([z.string(), carBodyStylesSchema, z.null()]),
    name: z.string(),
  }),

  fuel: z.object({
    typeInfo: z.object({
      type: z.string(),
      fullForm: z.string(),
    }),
  }),

  posterImage: z.object({
    originalUrl: z.string().url(),
    thumbnailUrl: z.string().url().optional(),
  }),

  imageUrls: z.array(z.string()).optional(),

  videoUrls: z
    .array(
      z.object({
        thumbnailUrl: z.string().url().optional(),
        url: z.string().url(),
      }),
    )
    .optional()
    .default([]),

  colors: z
    .array(
      z.object({
        name: z.string(),
        imageUrls: z.array(z.string().url()).optional(),
      }),
    )
    .default([]),

  numOfDoors: z.number(),

  price: z.object({
    min: z.number(),
    max: z.number(),
    isNegotiable: z.boolean(),
  }),

  tags: z.array(z.object({ value: z.string(), label: z.string(), _id: z.string() })).optional(),

  specificationsByGroup: z
    .array(
      z.object({
        groupName: z.string(),
        values: z.array(attributeSchema).optional(),
      }),
    )
    .optional(),

  additionalSpecifications: z.array(attributeSchema).optional(),

  carType: z.enum(['new', 'used']),

  launchedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),

  status: z.enum(['available', 'sold', 'reserved']).optional(),
  soldAt: z.string().optional(),
  cities: z.array(z.string()).optional(),
});
