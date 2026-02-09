import { z } from 'zod';

const ProductAggregationEnum = z.enum([
  'sku_id',
  'product_id',
  'department_id',
  'sub_department_id',
  'style_id',
  'season_id',
  'gender_id',
  'product_group',
]);
const LocationAggregationEnum = z.enum([
  'location_id',
  'country_id',
  'location_type_id',
  'region_id',
  'location_group',
]);

// Aggregated response schema for the POST endpoint
export const SkuLocationAggregatedSchema = z.object({
  // Aggregations
  product_aggregation: z.string().nullable(),
  location_aggregation: z.string().nullable(),

  // Attributes
  num_departments: z.coerce.number().nullable(),
  num_sub_departments: z.coerce.number().nullable(),
  num_styles: z.coerce.number().nullable(),
  num_seasons: z.coerce.number().nullable(),
  num_genders: z.coerce.number().nullable(),
  num_products: z.coerce.number().nullable(),
  num_skus: z.coerce.number().nullable(),

  // Metrics
  sales_l30d: z.coerce.number().nullable(),
  sales_l60d: z.coerce.number().nullable(),
  sales_l90d: z.coerce.number().nullable(),
  inventory: z.coerce.number().nullable(),
  pending_from_production: z.coerce.number().nullable(),
  recommended_ia: z.coerce.number().nullable(),
  unconstrained_ia: z.coerce.number().nullable(),
  user_ia: z.coerce.number().nullable(),
  num_sku_locations: z.coerce.number().nullable(),
  num_assorted_sku_locations: z.coerce.number().nullable(),
  num_recommend_assort_sku_locations: z.coerce.number().nullable(),
});

export const SkuLocationAggregatedResponseSchema = SkuLocationAggregatedSchema.omit({
  product_aggregation: true,
  location_aggregation: true,
}).merge(
  z.object({
    product_dimension: z.object({
      aggregation: ProductAggregationEnum,
      value: z.string(),
    }),
    location_dimension: z.object({
      aggregation: LocationAggregationEnum,
      value: z.string(),
    }),
  })
);

export const SkuLocationBodySchema = z.object({
  product_aggregation: ProductAggregationEnum,
  location_aggregation: LocationAggregationEnum,
  filters: z
    .object({
      product: z
        .object({
          sku_id: z.array(z.string()),
          product_id: z.array(z.string()),
          department_id: z.array(z.string()),
          sub_department_id: z.array(z.string()),
          style_id: z.array(z.string()),
          season_id: z.array(z.string()),
          gender_id: z.array(z.string()),
          product_group: z.array(z.string()),
        })
        .optional(),
      location: z
        .object({
          location_id: z.array(z.string()),
          country_id: z.array(z.string()),
          location_type_id: z.array(z.string()),
          region_id: z.array(z.string()),
          location_group: z.array(z.string()),
        })
        .optional(),
    })
    .optional(),
});

export type SkuLocationAggregated = z.infer<typeof SkuLocationAggregatedSchema>;
export type SkuLocationBody = z.infer<typeof SkuLocationBodySchema>;
export type ProductAggregation = z.infer<typeof ProductAggregationEnum>;
export type LocationAggregation = z.infer<typeof LocationAggregationEnum>;

export const GenericAggregationResponseSchema = z.object({
  aggregations: z.array(
    z.discriminatedUnion('dimension', [
      z.object({
        dimension: z.literal('product'),
        aggregation: ProductAggregationEnum,
        value: z.string().nullable(),
      }),
      z.object({
        dimension: z.literal('location'),
        aggregation: LocationAggregationEnum,
        value: z.string().nullable(),
      }),
    ])
  ),
  aggregated_metrics: z.object({
    // Attributes
    num_departments: z.coerce.number().nullable(),
    num_sub_departments: z.coerce.number().nullable(),
    num_styles: z.coerce.number().nullable(),
    num_seasons: z.coerce.number().nullable(),
    num_genders: z.coerce.number().nullable(),
    num_products: z.coerce.number().nullable(),
    num_skus: z.coerce.number().nullable(),

    // Metrics
    sales_l30d: z.coerce.number().nullable(),
    sales_l60d: z.coerce.number().nullable(),
    sales_l90d: z.coerce.number().nullable(),
    inventory: z.coerce.number().nullable(),
    pending_from_production: z.coerce.number().nullable(),
    recommended_ia: z.coerce.number().nullable(),
    unconstrained_ia: z.coerce.number().nullable(),
    user_ia: z.coerce.number().nullable(),
    num_sku_locations: z.coerce.number().nullable(),
    num_assorted_sku_locations: z.coerce.number().nullable(),
    num_recommend_assort_sku_locations: z.coerce.number().nullable(),
  }),
});

export type GenericAggregationResponse = z.infer<typeof GenericAggregationResponseSchema>;
