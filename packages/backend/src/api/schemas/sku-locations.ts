import { z } from 'zod';

const ProductAggregationEnum = z.enum([
  'sku_id',
  'product_id',
  'department_id',
  'sub_department_id',
  'style_id',
  'season_id',
  'gender_id',
]);
const LocationAggregationEnum = z.enum([
  'location_id',
  'country_id',
  'location_type_id',
  'region_id',
]);

export const SkuLocationSchema = z.object({
  sku_id: z.string(),
  size_id: z.string().nullable(),
  product_id: z.string().nullable(),
  department_id: z.string().nullable(),
  department_desc: z.string().nullable(),
  sub_department_id: z.string().nullable(),
  sub_department_desc: z.string().nullable(),
  style_id: z.string().nullable(),
  style_desc: z.string().nullable(),
  season_id: z.string().nullable(),
  season_desc: z.string().nullable(),
  gender_id: z.string().nullable(),
  gender_desc: z.string().nullable(),
  product_groups: z.array(z.string()),
  location_id: z.string(),
  location_desc: z.string().nullable(),
  country_id: z.string().nullable(),
  country_desc: z.string().nullable(),
  location_type_id: z.string().nullable(),
  location_type_desc: z.string().nullable(),
  region_id: z.string().nullable(),
  region_desc: z.string().nullable(),
  location_groups: z.array(z.string()),
});

// Aggregated response schema for the POST endpoint
export const SkuLocationAggregatedSchema = z.object({
  product_aggregation_value: z.string(),
  location_aggregation_value: z.string(),
  sales_l30d: z.coerce.number().nullable(),
  sales_l60d: z.coerce.number().nullable(),
  sales_l90d: z.coerce.number().nullable(),
  inventory: z.coerce.number().nullable(),
  pending_from_production: z.coerce.number().nullable(),
  recommended_ia: z.coerce.number().nullable(),
  unconstrained_ia: z.coerce.number().nullable(),
  user_ia: z.coerce.number().nullable(),
  assortment_recommendation: z.boolean().nullable(),
  assorted: z.boolean().nullable(),
});

export const SkuLocationAggregatedResponseSchema = SkuLocationAggregatedSchema.omit({
  product_aggregation_value: true,
  location_aggregation_value: true,
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
});

export type SkuLocation = z.infer<typeof SkuLocationSchema>;
export type SkuLocationAggregated = z.infer<typeof SkuLocationAggregatedSchema>;
export type SkuLocationBody = z.infer<typeof SkuLocationBodySchema>;
export type ProductAggregation = z.infer<typeof ProductAggregationEnum>;
export type LocationAggregation = z.infer<typeof LocationAggregationEnum>;

export const GenericAggregationResponseSchema = z.object({
  aggregations: z.array(
    z.object({ dimension: z.string(), aggregation: z.string(), value: z.string() })
  ),
  aggregated_metrics: z.object({
    sales_l30d: z.coerce.number().nullable(),
    sales_l60d: z.coerce.number().nullable(),
    sales_l90d: z.coerce.number().nullable(),
    inventory: z.coerce.number().nullable(),
    pending_from_production: z.coerce.number().nullable(),
    recommended_ia: z.coerce.number().nullable(),
    unconstrained_ia: z.coerce.number().nullable(),
    user_ia: z.coerce.number().nullable(),
  }),
});

export type GenericAggregationResponse = z.infer<typeof GenericAggregationResponseSchema>;
