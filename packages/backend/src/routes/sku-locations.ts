import { zodiosRouter } from '@zodios/express'
import { skuLocationsApi } from '../api/contract.js'
import { getAggregatedSkuLocations } from '../api/queries/index.js'

export const skuLocationsRouter = zodiosRouter(skuLocationsApi)

skuLocationsRouter.post('/', async (req, res) => {
  const { product_aggregation, location_aggregation } = req.body

  const skuLocationsAggregated = await getAggregatedSkuLocations(product_aggregation, location_aggregation)
  const skuLocationsAggregatedResponse = skuLocationsAggregated.map(skuLocation => ({
    aggregations: [
      {
        dimension: 'product',
        aggregation: product_aggregation,
        value: skuLocation.product_aggregation_value,
      },
      {
        dimension: 'location',
        aggregation: location_aggregation,
        value: skuLocation.location_aggregation_value,
      },
    ],
    aggregated_metrics: {
      sales_l30d: skuLocation.sales_l30d,
      sales_l60d: skuLocation.sales_l60d,
      sales_l90d: skuLocation.sales_l90d,
      inventory: skuLocation.inventory,
      pending_from_production: skuLocation.pending_from_production,
      recommended_ia: skuLocation.recommended_ia,
      unconstrained_ia: skuLocation.unconstrained_ia,
      user_ia: skuLocation.user_ia,
    },
  }))

  res.json(skuLocationsAggregatedResponse)
})