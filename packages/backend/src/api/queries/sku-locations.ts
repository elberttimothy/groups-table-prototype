import z from 'zod';
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import {
  LocationAggregation,
  ProductAggregation,
  SkuLocationAggregatedSchema,
} from '../schemas/sku-locations';

export const getAggregatedSkuLocations = async (
  product_aggregation: ProductAggregation,
  location_aggregation: LocationAggregation
) => {
  const productCol = Prisma.raw(`slj.${product_aggregation}`);
  const locationCol = Prisma.raw(`slj.${location_aggregation}`);

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
    )

    SELECT
      ${productCol} AS product_aggregation,
      ${locationCol} AS location_aggregation,
      SUM(slj.sales_l30d)::INT as sales_l30d, 
        SUM(slj.sales_l60d)::INT as sales_l60d, 
        SUM(slj.sales_l90d)::INT as sales_l90d, 
        SUM(slj.inventory)::INT as inventory, 
        SUM(slj.pending_from_production)::INT as pending_from_production, 
        SUM(slj.recommended_ia)::INT as recommended_ia, 
        SUM(slj.unconstrained_ia)::INT as unconstrained_ia, 
        SUM(slj.user_ia)::INT as user_ia,
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
