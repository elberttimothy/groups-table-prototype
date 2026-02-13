import { z } from 'zod';

// ============================================
// Enums
// ============================================
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

// ============================================
// Reusable Schemas
// ============================================
const NullableFilterArray = z.array(z.string().nullable()).optional();

const AggregatedMetricsSchema = z.object({
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

const ProductDimensionSchema = z.object({
  aggregation: ProductAggregationEnum,
  value: z.string().nullable(),
});

const LocationDimensionSchema = z.object({
  aggregation: LocationAggregationEnum,
  value: z.string().nullable(),
});

// ============================================
// Request/Response Schemas
// ============================================

// Aggregated response schema for the POST endpoint
export const SkuLocationAggregatedSchema = z
  .object({
    product_aggregation: z.string().nullable(),
    location_aggregation: z.string().nullable(),
  })
  .merge(AggregatedMetricsSchema);

export const SkuLocationAggregatedResponseSchema = AggregatedMetricsSchema.merge(
  z.object({
    product_dimension: ProductDimensionSchema.extend({ value: z.string() }),
    location_dimension: LocationDimensionSchema.extend({ value: z.string() }),
  })
);

export const SkuLocationBodySchema = z.object({
  dimension_aggregations: z.object({
    product: ProductAggregationEnum,
    location: LocationAggregationEnum,
  }),
  filters: z
    .object({
      // Product filters
      sku_id: NullableFilterArray,
      product_id: NullableFilterArray,
      department_id: NullableFilterArray,
      sub_department_id: NullableFilterArray,
      style_id: NullableFilterArray,
      season_id: NullableFilterArray,
      gender_id: NullableFilterArray,
      product_group: NullableFilterArray,
      // Location filters
      location_id: NullableFilterArray,
      country_id: NullableFilterArray,
      location_type_id: NullableFilterArray,
      region_id: NullableFilterArray,
      location_group: NullableFilterArray,
    })
    .optional(),
});

export const SkuLocationResponseSchema = z.object({
  dimensions: z.object({
    product: ProductDimensionSchema,
    location: LocationDimensionSchema,
  }),
  aggregated_metrics: AggregatedMetricsSchema,
});

export const EditSkuLocationInitialAllocationBodySchema = z.object({
  dimension_aggregations: z.object({
    product: ProductDimensionSchema,
    location: LocationDimensionSchema,
  }),
  // filters: z.object({
  //   // Product filters
  //   sku_id: NullableFilterArray,
  //   product_id: NullableFilterArray,
  //   department_id: NullableFilterArray,
  //   sub_department_id: NullableFilterArray,
  //   style_id: NullableFilterArray,
  //   season_id: NullableFilterArray,
  //   gender_id: NullableFilterArray,
  //   product_group: NullableFilterArray,

  //   // Location filters
  //   location_id: NullableFilterArray,
  //   country_id: NullableFilterArray,
  //   location_type_id: NullableFilterArray,
  //   region_id: NullableFilterArray,
  //   location_group: NullableFilterArray,
  // }),
  payload: z.object({
    initial_allocation: z.coerce.number(),
  }),
});

// ============================================
// Type Exports
// ============================================
export type SkuLocationAggregated = z.infer<typeof SkuLocationAggregatedSchema>;
export type SkuLocationBody = z.infer<typeof SkuLocationBodySchema>;
export type ProductAggregation = z.infer<typeof ProductAggregationEnum>;
export type LocationAggregation = z.infer<typeof LocationAggregationEnum>;
export type SkuLocationResponse = z.infer<typeof SkuLocationResponseSchema>;
export type EditSkuLocationInitialAllocationBody = z.infer<
  typeof EditSkuLocationInitialAllocationBodySchema
>;
export type ProductDimension = z.infer<typeof ProductDimensionSchema>;
export type LocationDimension = z.infer<typeof LocationDimensionSchema>;
