import z from 'zod';
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import {
  LocationAggregation,
  ProductAggregation,
  SkuLocationAggregatedSchema,
  SkuLocationBody,
} from '../schemas/sku-locations';

const createConditionClause = (alias: string, attributeName: string, ids: string[]) =>
  `${alias}.${attributeName} IN (${ids.map((id) => `'${id}'`).join(',')})`;

const createConditions = (filters: SkuLocationBody['filters']) => {
  const conditions = ['TRUE'];
  if (filters?.product) {
    const productFilterEntries = Object.entries(filters.product)
      .map(([key, value]) => [key, value?.filter((id) => id !== null) ?? []] as const)
      .filter(([_, ids]) => ids?.length > 0);
    for (const [attributeName, ids] of productFilterEntries) {
      conditions.push(
        createConditionClause(
          attributeName === 'product_group' ? 'pgm' : 'sl',
          attributeName === 'product_group' ? 'name' : attributeName,
          ids
        )
      );
    }
  }
  if (filters?.location) {
    const locationFilterEntries = Object.entries(filters.location)
      .map(([key, value]) => [key, value?.filter((id) => id !== null) ?? []] as const)
      .filter(([_, ids]) => ids?.length > 0);
    for (const [attributeName, ids] of locationFilterEntries) {
      conditions.push(
        createConditionClause(
          attributeName === 'location_group' ? 'lgm' : 'sl',
          attributeName === 'location_group' ? 'name' : attributeName,
          ids
        )
      );
    }
  }
  return Prisma.raw(conditions.join(' AND '));
};

export const getAggregatedSkuLocations = async (
  product_aggregation: ProductAggregation,
  location_aggregation: LocationAggregation,
  filters: SkuLocationBody['filters']
) => {
  const productCol = Prisma.raw(`slj.${product_aggregation}`);
  const locationCol = Prisma.raw(`slj.${location_aggregation}`);
  const conditions = createConditions(filters);

  console.log(conditions);

  const skuLocationsAggregatedRaw = await prisma.$queryRaw`
    WITH sku_locations_joined AS (
      SELECT
        sl.*,
        pgm.name AS product_group,
        lgm.name AS location_group,
        slm.sales_l30d,
        slm.sales_l60d,
        slm.sales_l90d,
        slm.inventory,
        slm.pending_from_production,
        slm.recommended_ia,
        slm.unconstrained_ia,
        slm.user_ia,
        slm.assorted,
        slm.assortment_recommendation
      FROM sku_locations sl
      LEFT JOIN sku_location_metrics slm USING (
        sku_id,
        location_id
      )
      LEFT JOIN product_groups_map pgm USING (
        sku_id, 
        location_id
      )
      LEFT JOIN location_groups_map lgm USING (
        sku_id,
        location_id
      )
      WHERE ${conditions}
    )

    SELECT
      -- aggregations
      ${productCol} AS product_aggregation,
      ${locationCol} AS location_aggregation,
      
      -- attributes
      COUNT(DISTINCT slj.department_id)::INT AS num_departments,
      COUNT(DISTINCT slj.sub_department_id)::INT AS num_sub_departments,
      COUNT(DISTINCT slj.style_id)::INT AS num_styles,
      COUNT(DISTINCT slj.season_id)::INT AS num_seasons,
      COUNT(DISTINCT slj.gender_id)::INT AS num_genders,
      COUNT(DISTINCT slj.product_id)::INT AS num_products,
      COUNT(DISTINCT slj.sku_id)::INT AS num_skus,

      -- metrics
      SUM(slj.sales_l30d)::INT AS sales_l30d, 
      SUM(slj.sales_l60d)::INT AS sales_l60d, 
      SUM(slj.sales_l90d)::INT AS sales_l90d, 
      SUM(slj.inventory)::INT AS inventory, 
      SUM(slj.pending_from_production)::INT AS pending_from_production, 
      SUM(slj.recommended_ia)::INT AS recommended_ia, 
      SUM(slj.unconstrained_ia)::INT AS unconstrained_ia, 
      SUM(slj.user_ia)::INT AS user_ia,
      COUNT(*) AS num_sku_locations,
      COUNT(*) FILTER (WHERE slj.assorted IS TRUE) AS num_assorted_sku_locations,
      COUNT(*) FILTER (WHERE slj.assortment_recommendation IS TRUE) AS num_recommend_assort_sku_locations
    FROM sku_locations_joined slj
    GROUP BY
      ${productCol}, ${locationCol}
    LIMIT 1000
`;
  return z.array(SkuLocationAggregatedSchema).parse(skuLocationsAggregatedRaw);
};
