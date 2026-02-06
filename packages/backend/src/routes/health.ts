import { zodiosRouter } from '@zodios/express'
import { healthApi } from '../api/contract.js'
import { prisma } from '../lib/prisma.js'

export const healthRouter = zodiosRouter(healthApi)

healthRouter.get('/', async (_req, res) => {
  try {
    // Test database connection by counting users
    await prisma.user.count()

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

