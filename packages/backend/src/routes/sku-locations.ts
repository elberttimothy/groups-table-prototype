import { zodiosRouter } from '@zodios/express'
import { skuLocationsApi } from '../api/contract.js'
import { prisma } from '../lib/prisma.js'

export const skuLocationsRouter = zodiosRouter(skuLocationsApi)

skuLocationsRouter.post('/', async (req, res) => {
  console.log(req.body)
  const skuLocations = await prisma.skuLocation.findMany({ take: 100 })
  res.json(skuLocations)
})