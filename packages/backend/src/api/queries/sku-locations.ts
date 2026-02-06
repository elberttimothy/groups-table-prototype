import z from "zod"
import { Prisma } from "../../generated/prisma/client"
import { prisma } from "../../lib/prisma"
import { LocationAggregation, ProductAggregation, SkuLocationAggregatedSchema } from "../schemas/sku-locations"

export const getAggregatedSkuLocations = async (product_aggregation: ProductAggregation, location_aggregation: LocationAggregation) => {
  const productCol = Prisma.raw(`sl.${product_aggregation}`)
  const locationCol = Prisma.raw(`sl.${location_aggregation}`)

  const skuLocationsAggregatedRaw = await prisma.$queryRaw`
  SELECT 
    ${productCol} as product_aggregation_value, 
    ${locationCol} as location_aggregation_value, 
    SUM(slm.sales_l30d)::int as sales_l30d, 
    SUM(slm.sales_l60d)::int as sales_l60d, 
    SUM(slm.sales_l90d)::int as sales_l90d, 
    SUM(slm.inventory)::int as inventory, 
    SUM(slm.pending_from_production)::int as pending_from_production, 
    SUM(slm.recommended_ia)::int as recommended_ia, 
    SUM(slm.unconstrained_ia)::int as unconstrained_ia, 
    SUM(slm.user_ia)::int as user_ia, 
    BOOL_OR(slm.assortment_recommendation) as assortment_recommendation, 
    BOOL_OR(slm.assorted) as assorted
  FROM sku_locations sl
  LEFT JOIN sku_location_metrics slm ON 
    sl.sku_id = slm.sku_id 
    AND sl.location_id = slm.location_id
  GROUP BY ${productCol}, ${locationCol}
  LIMIT 100
`
  return z.array(SkuLocationAggregatedSchema).parse(skuLocationsAggregatedRaw)
}