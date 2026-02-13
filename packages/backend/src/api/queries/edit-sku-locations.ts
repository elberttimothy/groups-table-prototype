import z from 'zod';
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { LocationDimension, ProductDimension, SkuLocationBody } from '../schemas';
import { createConditions } from './conditions';

const SkuLocationSchema = z.object({
  sku_id: z.string(),
  location_id: z.string(),
});

type SkuLocation = z.infer<typeof SkuLocationSchema>;

const getSkuLocations = async (
  product_aggregation: ProductDimension,
  location_aggregation: LocationDimension,
  filters: SkuLocationBody['filters']
) => {
  const filtersWithAggregations = {
    ...filters,
    [product_aggregation.aggregation]: [
      ...(filters?.[product_aggregation.aggregation] ?? []),
      product_aggregation.value,
    ],
    [location_aggregation.aggregation]: [
      ...(filters?.[location_aggregation.aggregation] ?? []),
      location_aggregation.value,
    ],
  };
  const conditions = createConditions(filtersWithAggregations);

  const skuLocationCountRaw = await prisma.$queryRaw`
    WITH sku_locations_joined AS (
      SELECT
        sl.*,
        pgm.name AS product_group,
        lgm.name AS location_group
      FROM sku_locations sl
      LEFT JOIN product_groups_map pgm USING (sku_id, location_id)
      LEFT JOIN location_groups_map lgm USING (sku_id, location_id)
      WHERE ${conditions}
    )
    
    SELECT
      slj.sku_id,
      slj.location_id
    FROM sku_locations_joined slj
  `;

  return z.array(SkuLocationSchema).parse(skuLocationCountRaw);
};

type IADistribution = (SkuLocation & { user_ia: number })[];

const createIADistribution = (
  skuLocations: SkuLocation[],
  bulkInitialAllocation: number
): IADistribution => {
  const skuLocationsCount = skuLocations.length;
  const iaPerSkuLocation = bulkInitialAllocation / skuLocationsCount;
  const canDistribute = iaPerSkuLocation >= 1;
  if (!canDistribute) {
    return skuLocations.map((skuLocation, idx) => ({
      ...skuLocation,
      user_ia: idx > bulkInitialAllocation - 1 ? 0 : 1,
    }));
  }

  const flooredIaPerSkuLocation = Math.floor(iaPerSkuLocation);
  return skuLocations.map((skuLocation, idx) => {
    const allocated =
      idx < skuLocationsCount - 1
        ? flooredIaPerSkuLocation
        : bulkInitialAllocation - idx * flooredIaPerSkuLocation;
    return {
      ...skuLocation,
      user_ia: allocated,
    };
  });
};

const updateSkuLocationMetrics = async (iaDistribution: IADistribution) => {
  const values = iaDistribution.map(
    ({ sku_id, location_id, user_ia }) => `('${sku_id}', '${location_id}', ${user_ia})`
  );
  const valuesJoined = Prisma.raw(values.join(','));

  const result = await prisma.$queryRaw`
    WITH updates (sku_id, location_id, user_ia) AS (
      VALUES ${valuesJoined}
    )
    UPDATE sku_location_metrics slm
    SET user_ia = updates.user_ia
    FROM updates
    WHERE (slm.sku_id, slm.location_id) = (updates.sku_id, updates.location_id)
  `;
  return result;
};

export const editSkuLocationInitialAllocation = async (
  product_aggregation: ProductDimension,
  location_aggregation: LocationDimension,
  filters: SkuLocationBody['filters'],
  initial_allocation: number
): Promise<number> => {
  const skuLocations = await getSkuLocations(product_aggregation, location_aggregation, filters);
  if (skuLocations.length === 0) return 0;

  const iaDistribution = createIADistribution(skuLocations, initial_allocation);
  await updateSkuLocationMetrics(iaDistribution);
  return iaDistribution.length;
};
