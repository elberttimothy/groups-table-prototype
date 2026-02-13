import z from 'zod';
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { LocationDimension, ProductDimension } from '../schemas';

const SkuLocationSchema = z.object({
  sku_id: z.string(),
  location_id: z.string(),
});

type SkuLocation = z.infer<typeof SkuLocationSchema>;

const getSkuLocations = async (
  product_aggregation: ProductDimension,
  location_aggregation: LocationDimension
) => {
  const product_aggregation_clause = Prisma.raw(
    `sl.${product_aggregation.aggregation} = '${product_aggregation.value}'`
  );
  const location_aggregation_clause = Prisma.raw(
    `sl.${location_aggregation.aggregation} = '${location_aggregation.value}'`
  );

  const skuLocationCountRaw = await prisma.$queryRaw`
    SELECT
      sl.sku_id,
      sl.location_id
    FROM sku_locations sl
    WHERE ${product_aggregation_clause} AND ${location_aggregation_clause}
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
  initial_allocation: number
): Promise<number> => {
  const skuLocations = await getSkuLocations(product_aggregation, location_aggregation);
  if (skuLocations.length === 0) return 0;

  const iaDistribution = createIADistribution(skuLocations, initial_allocation);
  await updateSkuLocationMetrics(iaDistribution);
  return iaDistribution.length;
};
