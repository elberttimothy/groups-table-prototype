import { zodiosRouter } from '@zodios/express';
import { skuLocationsApi } from '../api/contract.js';
import { editSkuLocationInitialAllocation } from '../api/queries/edit-sku-locations.js';
import { getAggregatedSkuLocations } from '../api/queries/index.js';
import { SkuLocationResponseSchema } from '../api/schemas/sku-locations.js';

export const skuLocationsRouter = zodiosRouter(skuLocationsApi);

skuLocationsRouter.post('/', async (req, res) => {
  const { dimension_aggregations, filters } = req.body;

  const skuLocationsAggregated = await getAggregatedSkuLocations(
    dimension_aggregations.product,
    dimension_aggregations.location,
    filters
  );
  const skuLocationsAggregatedResponse = skuLocationsAggregated.map((skuLocation) =>
    SkuLocationResponseSchema.parse({
      dimensions: {
        product: {
          aggregation: dimension_aggregations.product,
          value: skuLocation.product_aggregation,
        },
        location: {
          aggregation: dimension_aggregations.location,
          value: skuLocation.location_aggregation,
        },
      },
      aggregated_metrics: {
        // Attributes
        num_departments: skuLocation.num_departments,
        num_sub_departments: skuLocation.num_sub_departments,
        num_styles: skuLocation.num_styles,
        num_seasons: skuLocation.num_seasons,
        num_genders: skuLocation.num_genders,
        num_products: skuLocation.num_products,
        num_skus: skuLocation.num_skus,

        // Metrics
        sales_l30d: skuLocation.sales_l30d,
        sales_l60d: skuLocation.sales_l60d,
        sales_l90d: skuLocation.sales_l90d,
        inventory: skuLocation.inventory,
        pending_from_production: skuLocation.pending_from_production,
        recommended_ia: skuLocation.recommended_ia,
        unconstrained_ia: skuLocation.unconstrained_ia,
        user_ia: skuLocation.user_ia,
        num_sku_locations: skuLocation.num_sku_locations,
        num_assorted_sku_locations: skuLocation.num_assorted_sku_locations,
        num_recommend_assort_sku_locations: skuLocation.num_recommend_assort_sku_locations,
      },
    })
  );

  res.json(skuLocationsAggregatedResponse);
});

skuLocationsRouter.patch('/initial-allocation', async (req, res) => {
  const { dimension_aggregations, payload } = req.body;

  const updatedCount = await editSkuLocationInitialAllocation(
    dimension_aggregations.product,
    dimension_aggregations.location,
    payload.initial_allocation
  );
  res.json({ updated_count: updatedCount });
});
